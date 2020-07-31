export interface IInvite extends Document {
  _id: string;
  email?: string;
  phone?: string;
  code: number;
  user: number;
  event_id?: string;
  circle_id?: string;
  status?: string;
}

export interface IInvites extends Document {
  [key: number]: IInvite;
}