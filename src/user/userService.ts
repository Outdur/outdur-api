import { IUser } from "./userInterface";
import { IUsers } from "./usersInterface";
import { isEmail, isLength, isNumeric } from "../helpers/validator";
import { userModel } from './userModel';
import { handleError } from "../helpers/handleError";
import { activityModel } from "../activity/model";
import { circleModel, circleMemberModel } from "../circle/model";
// import { upload } from '../helpers/awsHelper';
import { upload } from '../helpers/imageHelper';
import { cloudinary } from '../helpers/cloudinary';
// import { resizeAndUpload } from '../helpers/imageHelper';
const jwt = require('jsonwebtoken');
const MUUID = require('uuid-mongodb');

const create = async (userData: any) => {
    const validationError = validateNewUser(userData);
    if (validationError) throw new handleError(422, validationError);

    const key = isNumeric(userData.contact) ? 'phone' : 'email';

    // check if user exist
    const foundUser = await userModel.findOne({ [key]: userData.contact });
    if (foundUser) return foundUser;

    const user = {
        [key]: userData.contact,
        device_id: userData.device_id,
        device_platform: userData.device_platform
    };
   
    return userModel.create({ ...user, user_id: MUUID.v4() });

}

const findOne = async (user_id: number): Promise<IUser | any> => {
    const user =  await userModel.findOne({ user_id });
    if (!user) throw new handleError(404, 'User not found');
    return user;
}

const find = async (): Promise<IUsers | any[]> => {
    return await userModel.find();
}

const update = async (userData: any, photoFile: any | null): Promise<IUser | any> => {
    const id = userData.user.id;
    delete userData.user;
    
    const validationError = validateUpdateUser(userData);
    if (validationError) throw new handleError(422, validationError);

    let image_url;
    if (photoFile) {
        // const key = `profile_photo/${id}${require('path').extname(photoFile.photo.name)}`;
        // const resizedKey = `profile_photo/${id}--width-150${require('path').extname(photoFile.photo.name)}`;
        // upload(process.env.BUCKET_NAME, key, photoFile.photo.data).then(async () => {
        //     const data = {
        //         photo_url: process.env.BUCKET_STATIC_URL + key,
        //         thumb: process.env.BUCKET_STATIC_URL + resizedKey
        //     }
        //     await userModel.findByIdAndUpdate(id, data);
        // }).catch((err: any) => {
        //     console.log(err);
        // });
        image_url = await uploadPhoto(photoFile, id);

        // resize for thumb
        // resizeAndUpload(resizedKey, photoFile.photo.data, { width: 150 });
    }
    
    return userModel.findByIdAndUpdate(id, { ...userData, ...image_url }, { new: true });
}

// const listUserInterests = async (user_id: number): Promise<object> => {
//     return userInterestModel.findOne({ user_id }).populate('interests');
// }

const updateInterest = async (userInterests: any): Promise<any> => {
    if (Array.isArray(userInterests.interests) && !userInterests.interests.length) throw new handleError(422, 'Interest cannot be empty');
    if (!userInterests.interests || !Array.isArray(userInterests.interests)) throw new handleError(422, 'Interests field must be an array');

    
    const validInterests = await activityModel.find({ activity_title: { $in: userInterests.interests } });
    if (validInterests) {
        const user = await userModel.findOne({ user_id: userInterests.user_id }).populate('interestIds');
        validInterests.forEach((interest: any) => !user.interestIds.includes(interest.id) && user.interestIds.push(interest.id));
        await user.save();
    }
}

const generateUserToken = async (user: IUser): Promise<string> => {
    const interests = await activityModel.find({ id: { $in: user.interestIds } }).select('-_id activity_title').lean();
    const circleIds = await circleModel.find({ user: user.id }).distinct('_id');
    const payload = { contact: user.email ? user.email : user.phone, id: user.id, user_id: user.user_id, interests, circles: circleIds };
    return jwt.sign(payload, process.env.JWT_SECRET);
}

const validateNewUser = (user: any): null | string => {
    if (!user.contact) return 'Contact field must not be empty';
    if (isNumeric(user.contact)) {
        if (!isLength(user.contact, { min: 6, max: 15 })) return 'Contact phone must not be less than 6 or greater than 15 numbers';
    } else {
        if (!isEmail(user.contact)) return 'Contact email is invalid';
    }
    return null;
}

const validateUpdateUser = (user: any): null | string => {
    Object.keys(user).forEach(key => {
        if (!['phone', 'firstname', 'lastname'].includes(key)) throw new handleError(422, `The field ${key} is not allowed`);
    });

    if (user.phone && isNumeric(user.phone)) {
        if (!isLength(user.phone, { min: 6, max: 15 })) return 'Phone must not be less than 6 or greater than 15 numbers';
    } else if (user.phone && !isNumeric(user.phone)) return 'Phone must be numeric';
    if (user.email && !isEmail(user.email)) return 'Contact email is invalid';
    return null;
}

const uploadPhoto = async (image: any, user_id: String) => {
    const { public_id, format, secure_url } = await upload({ file: image.photo.data, filename: user_id, folder: 'profile-photos/' });
    const img_url = `${public_id}.${format}`;
    const photo_url = {
        photo_url: secure_url,
        thumb: cloudinary.url(img_url, { width: 150, height: 150, crop: "fill", secure: true })
    };
    return photo_url;
}

module.exports = {
    create,
    findOne,
    find,
    update,
    updateInterest,
    generateUserToken
}