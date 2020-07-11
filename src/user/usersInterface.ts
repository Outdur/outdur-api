import { IUser } from "./userInterface";

export interface IUsers extends Document {
    [key: number]: IUser;
}