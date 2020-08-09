import { IUser } from "./userInterface";
import { IUsers } from "./usersInterface";
import { isEmail, isLength, isNumeric } from "../helpers/validator";
import { userModel } from './userModel';
import { handleError } from "../helpers/handleError";
import { activityModel } from "../activity/model";
import { userInterestModel } from "./userInterestModel";
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

const update = async (userData: any): Promise<IUser | any> => {
    const id = userData.user.id;
    delete userData.user;
    
    const validationError = validateUpdateUser(userData);
    if (validationError) throw new handleError(422, validationError);
    
    const updatedUser = await userModel.findByIdAndUpdate(id, userData, { new: true });
    return updatedUser;
}

const listUserInterests = async (user_id: number): Promise<object> => {
    return userInterestModel.find({ user_id });
}

const updateInterest = async (userInterests: any): Promise<any> => {
    if (!userInterests.interests) throw new handleError(422, 'No interest was specified');

    let userInterest = await userInterestModel.find({ user_id: userInterests.user_id }).populate('interests');
    if (!userInterest) userInterest = await userInterestModel.create({ user_id: userInterests.user_id });

    userInterests.interests.forEach(async (interest: string) => {
        const userInterest = await activityModel.findOne({ activity_title: interest });
        userInterest.interests.push(userInterest);
        await userInterest.save();
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