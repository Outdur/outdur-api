import { handleError } from "../helpers/handleError";
import { eventModel } from './model';
import { IEvent, IEvents } from './interface';
import { userModel } from "../user/userModel";
import { circleModel } from "../circle/model";



const create = async (eventData: any): Promise<IEvent> => {
    const validationError = await validateEvent(eventData);
    if (validationError) throw new handleError(422, validationError);

    return await eventModel.create(eventData);
}

const findOne = async (event_id: number): Promise<IEvent> => {
    const event = await eventModel.findOne({ event_id });
    if (!event) throw new handleError(404, 'Event not found');
    return event;
}

const findAll = async (): Promise<IEvents> => {
    return await eventModel.find();
}

const update = async (event: IEvent): Promise<IEvent> => {
    const validationError = await validateEvent(event);
    if (validationError) throw new handleError(422, validationError);

    const event_id = event.event_id;
    delete event.event_id;
    const updatedEvent = await eventModel.findOneAndUpdate({ event_id }, event, { new: true });
    return updatedEvent;
}

const validateEvent = async (event: IEvent): Promise<null | string> => {
    if (!event.title) return 'Event must have a title';
    if (!event.description) return 'Event must have a description';
    if (!event.venue) return 'Event must have a venue';
    if (!event.event_date) return 'Event must have a date';
    if (!event.user_id && !event.circle_id) return 'Event must have a user_id or circle_id';
    if (event.user_id && event.circle_id) return 'Event cannot have both user_id and circle_id. Only one of them can be set';
    if (event.user_id) if (! await userModel.findOne(event.user_id)) return 'Invalid user_id';
    if (event.circle_id) if (! await circleModel.findOne(event.circle_id)) return 'Invalid circle_id';
    return null;
};


module.exports = {
    create,
    findOne,
    findAll,
    update
};