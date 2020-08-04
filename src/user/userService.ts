import { IUser } from "./userInterface";
import { IUsers } from "./usersInterface";
import { isEmail, isLength, isNumeric } from "../helpers/validator";
import { userModel } from './userModel';
import { handleError } from "../helpers/handleError";
const jwt = require('jsonwebtoken');


const create = async (userData: any) => {
    const validationError = validateNewUser(userData);
    if (validationError) throw new handleError(422, validationError);

    const userContact = isNumeric(userData.contact) ? { phone: userData.contact } : { email: userData.contact };

    // check if user exist
    const foundUser = await userModel.findOne(userModel);
    if (foundUser) return foundUser;
   
    return userModel.create(userContact);
}

const findOne = async (user_id: number): Promise<IUser | any> => {
    const user =  await userModel.findOne({ user_id });
    if (!user) throw new handleError(404, 'User not found');
    return user;
}

const findAll = async (): Promise<IUsers | any[]> => {
    return await userModel.find();
}

const update = async (userData: IUser): Promise<IUser | any> => {
    const validationError = validateUpdateUser(userData);
    if (validationError) throw new handleError(422, validationError);
    
    const user_id = userData.user_id;
    delete userData.user_id;
    const updatedUser = await userModel.findOneAndUpdate({ user_id }, userData, { new: true });
    return updatedUser;
}

const generateUserToken = (user: IUser): string => {
    const payload = { contact: user.email ? user.email : user.phone, id: user._id };
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
        if (!['email', 'phone', 'firstname', 'lastname', 'user_id'].includes(key)) throw new Error(`The field ${key} is not allowed`);
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
    findAll,
    update,
    generateUserToken
}