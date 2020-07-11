
export interface IUser extends Document {
    _id: string;
    user_id?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string;
}