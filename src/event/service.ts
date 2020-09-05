import { handleError } from "../helpers/handleError";
import { eventModel, eventCommentModel } from './model';
import { IEvent, IEvents, IEventComment, IEventComments } from './interface';
import { userModel } from "../user/userModel";
import { circleModel } from "../circle/model";
import { upload } from '../helpers/awsHelper';

const MUUID = require('uuid-mongodb');

const eventFields = '-_id title description venue picture_url event_id createdAt';

const create = async (eventData: any): Promise<IEvent> => {
    const validationError = await validateEvent(eventData);
    if (validationError) throw new handleError(422, validationError);

    const newEvent = await eventModel.create({ ...eventData, event_id: MUUID.v4() });

    if (eventData.event_picture) {
        uploadPicture(eventData.event_picture, newEvent);
    }

    return newEvent;
}

const findOne = async (event_id: number): Promise<IEvent> => {
    const event = await eventModel.findOne({ event_id }).populate({ path: 'user', select: '-_id firstname lastname photo_url' }).select(eventFields);
    if (!event) throw new handleError(404, 'Event not found');

    event.comments = await getComments(event_id);
    return event;
}

const find = async (): Promise<IEvents> => {
    return eventModel.find().sort('-createdAt').populate({ path: 'user', select: '-_id firstname lastname photo_url' }).select(eventFields);
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

const deleteEvent = async (event_id: number) => {
    return eventModel.deleteOne({ event_id });
}

const postComment = async (eventComment: IEventComment): Promise<IEventComment> => {
    const validationError = await validateEventComment(eventComment);
    if (validationError) throw new handleError(422, validationError);

    const comment = await eventCommentModel.create({ ...eventComment, comment_id: MUUID.v4() });
    const event = await eventModel.findOne({ event_id: eventComment.event_id }).populate('comments');
    event.comments.push(comment);
    event.save();

    return comment;
}

const getComments = async(event_id: Number): Promise<IEventComments> => {
    return eventCommentModel.find({ event_id }).populate({ path: 'user', select: '-_id firstname lastname photo_url' }).select('-_id comment comment_id createdAt');
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
        (['user', 'circle_id', 'event_id'] as const).forEach(key => { delete event[key]; });
    } else {
        if (!event.title) return 'Event must have a title';
        if (!event.description) return 'Event must have a description';
        if (!event.venue) return 'Event must have a venue';
        if (!event.event_date) return 'Event must have a date';
        if (!event.event_tags) return 'Event must have at least one tag';
        if (event.circle_id && !await circleModel.findOne({ event_id: event.circle_id })) return 'Invalid circle_id';
    }
    return null;
};

const validateEventComment = async (eventComment: IEventComment): Promise<null | string> => {
    const { comment, event_id } = eventComment;
    if (!comment) return 'Comment cannot be empty';
    if (!event_id) return 'Event id was not specified';
    if (!await eventModel.findOne({ event_id })) return 'Invalid event id';
    return null;
}


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
    deleteEvent,
    postComment,
    getComments
};