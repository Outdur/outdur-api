import { IUser } from "./userInterface";
import { IUsers } from "./usersInterface";
import { isEmail, isLength, isNumeric } from "../helpers/validator";
import { userModel } from './userModel';
import { handleError } from "../helpers/handleError";


const create = async (userData: any) => {
    const validationError = validateNewUser(userData);
    if (validationError) throw new handleError(422, validationError);

    const userContact = isNumeric(userData.contact) ? { phone: userData.contact } : { email: userData.contact };
    try {
        return await userModel.create(userContact);
    } catch (err) {
        let message = err.code == '11000' ? 'Duplicate contact' : 'Unknown fatal error occurred';
        throw new handleError(500, message);
    }
}

const findOne = async (user_id: number): Promise<IUser | any> => {
    return await userModel.findOne({ user_id });
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
    if (user.phone && isNumeric(user.phone)) {
        if (!isLength(user.phone, { min: 6, max: 15 })) return 'Phone must not be less than 6 or greater than 15 numbers';
    } else if (user.phone && !isNumeric(user.phone)) return 'Phone must be numeric';
    if (user.email && !isEmail(user.phone)) return 'Contact email is invalid';
    return null;
}

module.exports = {
    create,
    findOne,
    findAll,
    update
}