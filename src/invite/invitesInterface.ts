import { IInvite } from "./inviteInterface";

export interface IInvites extends Document {
    [key: number]: IInvite;
}
