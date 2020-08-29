import { handleError } from "../helpers/handleError";
import { eventModel } from './model';
import { IEvent, IEvents } from './interface';
import { userModel } from "../user/userModel";
import { circleModel } from "../circle/model";
import { upload } from '../helpers/awsHelper';



const create = async (eventData: any): Promise<IEvent> => {
    eventData.user_id = eventData.user.id;
    delete eventData.user;
    const validationError = await validateEvent(eventData);
    if (validationError) throw new handleError(422, validationError);

    const newEvent = await eventModel.create(eventData);

    if (eventData.event_picture) {
        uploadPicture(eventData.event_picture, newEvent);
    }

    return newEvent;
}

const findOne = async (event_id: number): Promise<IEvent> => {
    const event = await eventModel.findOne({ event_id });
    if (!event) throw new handleError(404, 'Event not found');
    return event;
}

const find = async (): Promise<IEvents> => {
    return eventModel.find();
}

const update = async (event: any): Promise<IEvent> => {
    const event_id = event.event_id;
    const validationError = await validateEvent(event);
    if (validationError) throw new handleError(422, validationError);

    const updatedEvent = await eventModel.findOneAndUpdate({ event_id }, event, { new: true });

    if (event.event_picture) {
        uploadPicture(event.event_picture, updatedEvent);
    }

    return updatedEvent;
}

const deleteEvent = async (id: number) => {
    return eventModel.deleteOne({ _id: id });
}

const validateEvent = async (event: IEvent): Promise<null | string> => {
    if (event.event_id) {
        if (!await eventModel.findOne({ event_id: event.event_id })) throw new handleError(404, 'Event not found');

        if (event.title !== undefined && !event.title) return 'Event title cannot be empty';
        if (event.description !== undefined && !event.description) return 'Event description cannot be empty';
        if (event.venue !== undefined && !event.venue) return 'Event must have a venue';
        if (event.event_date !== undefined && !event.event_date) return 'Event must have a date';
        if (event.event_tags !== undefined && !event.event_tags) return 'Event must have at least one tag';
        
        // we don't want any of these to be edited
        (['user_id', 'circle_id', 'event_id'] as const).forEach(key => { delete event[key]; });
    } else {
        if (!event.title) return 'Event must have a title';
        if (!event.description) return 'Event must have a description';
        if (!event.venue) return 'Event must have a venue';
        if (!event.event_date) return 'Event must have a date';
        if (!event.event_tags) return 'Event must have at least one tag';
        if (!event.user_id && !event.circle_id) return 'Event must have a user_id or circle_id';
        if (event.user_id && event.circle_id) return 'Event cannot have both user_id and circle_id. Only one of them can be set';
        if (event.user_id && !await userModel.findById(event.user_id)) return 'Invalid user_id';
        if (event.circle_id && !await circleModel.findOne({ event_id: event.circle_id })) return 'Invalid circle_id';
    }
    return null;
};


function uploadPicture(picture: any, event: any) {
    const pic_name = event.title.split(' ').join('-') + `_${event.id}`;
    const key = `event_pictures/${pic_name}${require('path').extname(picture.picture.name)}`;
    
    upload(process.env.BUCKET_NAME, key, picture.picture.data).then(async () => {
        await eventModel.findByIdAndUpdate(event.id, { picture_url: process.env.BUCKET_STATIC_URL + key });
    }).catch((err: any) => {
        console.log(err);
    });
}


module.exports = {
    create,
    findOne,
    find,
    update,
    deleteEvent
};