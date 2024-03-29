import { IEvents } from "../event/interface";

export interface ICircle extends Document {
    _id: string;
    circle_id: string;
    name: String;
    description: string;
    type: string;
    user: string;
    events?: IEvents;
    members?: any;
    member_count?: Number;
    sanitize: () => any;
}

export interface ICircles extends Document {
    [key: number]: ICircle;
}