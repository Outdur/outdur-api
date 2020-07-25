export interface IEvent extends Document {
    _id: string;
    event_id: string;
    description: string;
    venue: string;
    event_date: string;
    user_id?: string;
    circle_id?: String;
}

export interface IEvents extends Document {
    [key: number]: IEvent;
}