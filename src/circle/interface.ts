import { IEvents } from "../event/interface";

export interface ICircle extends Document {
    _id: string;
    circle_id: string;
    name: String;
    description: string;
    type: string;
    user_id: string;
    events?: IEvents
}

export interface ICircles extends Document {
    [key: number]: ICircle;
}