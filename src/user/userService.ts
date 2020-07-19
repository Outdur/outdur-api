import { IUser } from "./userInterface";
import { IUsers } from "./usersInterface";
import { isEmail, isLength, isNumeric } from "../helpers/validator";
import { handleError } from "../helpers/handleError";


const create = async (newUser: any): Promise<IUser | object> => {
    const validationError = validateUser(newUser);
    if (validationError) throw new handleError(422, validationError);
    return newUser;
}

const findOne = async (id: number): Promise<IUser | any> => {
    const user = { _id: 'findone' };
    return user;
}

const findAll = async (): Promise<IUsers | any[]> => {
    const users: any[] | IUsers | PromiseLike<any[] | IUsers> = [];
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