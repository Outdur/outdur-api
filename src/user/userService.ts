import { IUser } from "./userInterface";
import { IUsers } from "./usersInterface";

const create = async (newUser: IUser): Promise<IUser> => {
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

module.exports = {
    create,
    findOne,
    findAll,
    update
}