export interface IEvent extends Document {
    _id: string;
    event_id: string;
    description: string;
    venue: string;
    event_date: string;
    event_tags?: String;
    user?: string;
    circle_id?: String;
}

export interface IEvents extends Document {
    [key: number]: IEvent;
}

export interface IEventComment extends Document {
    _id?: string;
    comment: string;
    event_id: string;
    user_id: string
}

export interface IEventComments extends Document {
    [key: number]: IEventComment;
}

export interface IEventInvite extends Document {
    event_attendance_id?: String;
    event_id: String;
    user: String;
    email?: String;
    phone?: String;
    status: String;
}

export interface IEventInvites extends Document {
    [key: number]: IEventInvite;
}