import { IUser } from "./userInterface";
import { IUsers } from "./usersInterface";
import { isEmail, isLength, isNumeric } from "../helpers/validator";
import { userModel } from './userModel';
import { handleError } from "../helpers/handleError";
import { activityModel } from "../activity/model";
import { userInterestModel } from "./userInterestModel";
import { upload } from '../helpers/awsHelper';
const jwt = require('jsonwebtoken');

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
   
    return userModel.create(user);

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

    if (photoFile) {
        const key = `profile_photo/${id}${require('path').extname(photoFile.photo.name)}`;
        upload(process.env.BUCKET_NAME, key, photoFile.photo.data).then(async () => {
            await userModel.findByIdAndUpdate(id, { photo_url: process.env.BUCKET_STATIC_URL + key });
        }).catch((err: any) => {
            console.log(err);
        });
    }
    
    const updatedUser = await userModel.findByIdAndUpdate(id, userData, { new: true });
    return updatedUser;
}

const listUserInterests = async (user_id: number): Promise<object> => {
    return userInterestModel.findOne({ user_id }).populate('interests');
}

const updateInterest = async (userInterests: any): Promise<any> => {
    if (Array.isArray(userInterests.interests) && !userInterests.interests.length) throw new handleError(422, 'Interest cannot be empty');
    if (!userInterests.interests || !Array.isArray(userInterests.interests)) throw new handleError(422, 'Interests field must be an array');

    let userInterest = await userInterestModel.findOne({ user_id: userInterests.user_id });
    if (!userInterest) userInterest = await userInterestModel.create({ user_id: userInterests.user_id });

    userInterests.interests.forEach(async (interest: string) => {
        const foundInterest = await activityModel.findOne({ activity_title: interest });
        if (foundInterest) {
            userInterest = await userInterestModel.findOne({ user_id: userInterests.user_id }).populate('interests');
            userInterest.interests.find((_interest: any) => _interest.activity_title !== interest) && userInterest.interests.push(foundInterest);
            await userInterest.save();
        }
    });
}

const generateUserToken = (user: IUser): string => {
    const payload = { contact: user.email ? user.email : user.phone, id: user._id, user_id: user.user_id };
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
        if (!['phone', 'firstname', 'lastname'].includes(key)) throw new Error(`The field ${key} is not allowed`);
    });

    if (user.phone && isNumeric(user.phone)) {
        if (!isLength(user.phone, { min: 6, max: 15 })) return 'Phone must not be less than 6 or greater than 15 numbers';
    } else if (user.phone && !isNumeric(user.phone)) return 'Phone must be numeric';
    if (user.email && !isEmail(user.email)) return 'Contact email is invalid';
    return null;
}

module.exports = {
    create,
    findOne,
    find,
    update,
    updateInterest,
    listUserInterests,
    generateUserToken
}