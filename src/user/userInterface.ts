
export interface IUser extends Document {
    id?: string;
    user_id?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string;
    interestIds: [String];
    device_id: String;
    device_platform: String;
}