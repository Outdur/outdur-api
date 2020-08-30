
export interface IUser extends Document {
    id?: string;
    user_id?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string;
    device_id: String;
    device_platform: String;
}