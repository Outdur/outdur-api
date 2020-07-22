import { IUser } from "./userInterface";
import { IUsers } from "./usersInterface";
import { isEmail, isLength, isNumeric } from "../helpers/validator";
import { userModel } from './userModel';
import { handleError } from "../helpers/handleError";


const create = async (userData: any) => {
    const validationError = validateUser(userData);
    if (validationError) throw new handleError(422, validationError);

    const userContact = isNumeric(userData.contact) ? { phone: userData.contact } : { email: userData.contact };
    try {
        return await userModel.create(userContact);
    } catch (err) {
        let message = err.code == '11000' ? 'Duplicate contact' : 'Unknown fatal error occurred';
        throw new handleError(500, message);
    }
}

const findOne = async (id: number): Promise<IUser | any> => {
    const user = { _id: 'findone' };
    return user;
}

const findAll = async (): Promise<IUsers | any[]> => {
    await userModel.remove({})
    let users: any[] | IUsers | PromiseLike<any[] | IUsers> = [];
    try {
        users = await userModel.find();
    } catch(err) {
        console.log(err)
    }
    return users;
}

const update = async (id: number): Promise<IUser | any> => {
    let user = { _id: 'update' };
    return user;
}

const validateUser = (user: any): null | string => {
    if (!user.contact) return 'Contact field must not be empty';
    if (isNumeric(user.contact)) {
        if (!isLength(user.contact, { min: 6, max: 15 })) return 'Contact phone must not be less than 6 or greater than 15 numbers';
    } else {
        if (!isEmail(user.contact)) return 'Contact email is invalid';
    }
    return null;
}

module.exports = {
    create,
    findOne,
    findAll,
    update
}