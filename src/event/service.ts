import { handleError } from "../helpers/handleError";
import { eventModel, eventCommentModel } from './model';
import { IEvent, IEvents, IEventComment, IEventComments } from './interface';
import { circleModel } from "../circle/model";
import { upload } from '../helpers/awsHelper';
import { resizeAndUpload } from '../helpers/imageHelper';
import { userModel } from "../user/userModel";

const MUUID = require('uuid-mongodb');

const eventFields = '-_id title description venue event_date event_time picture_url event_id createdAt';
const userFields = '-_id firstname lastname user_id photo_url thumb';

const create = async (eventData: any): Promise<IEvent> => {
    const validationError = await validateEvent(eventData);
    if (validationError) throw new handleError(422, validationError);

    const newEvent = await eventModel.create({ ...eventData, event_id: MUUID.v4() });

    let picture_url;
    if (eventData.event_picture) {
        picture_url = await uploadPicture(eventData.event_picture, newEvent);
    }

    const event = await eventModel.findById(newEvent.id).populate({ path: 'user', select: userFields }).select(eventFields);
    event.picture_url = picture_url;
    return event;
}

const findOne = async (event_id: number): Promise<IEvent> => {
    const event = await eventModel.findOne({ event_id }).populate({ path: 'user', select: userFields }).select(eventFields);
    if (!event) throw new handleError(404, 'Event not found');

    event.comments = await getComments(event_id);
    return event;
}

const find = async (): Promise<IEvents> => {
    return eventModel.find().sort('-createdAt').populate({ path: 'user', select: userFields }).select(eventFields);
}

const update = async (event: any): Promise<IEvent> => {
    const event_id = event.event_id;
    const validationError = await validateEvent(event);
    if (validationError) throw new handleError(422, validationError);

    const updatedEvent = await eventModel.findOneAndUpdate({ event_id }, event, { new: true });

    let picture_url;
    if (event.event_picture) {
        picture_url = await uploadPicture(event.event_picture, updatedEvent);
    }

    return { ...updatedEvent, picture_url };
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
    return eventCommentModel.find({ event_id }).sort('+createdAt').populate({ path: 'user', select: userFields }).select('-_id comment comment_id createdAt');
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


const uploadPicture = async (picture: any, event: any) => {
    const pic_name = event.title.split(' ').join('-') + `_${event.id}`;
    const key = `event_pictures/${pic_name}${require('path').extname(picture.picture.name)}`;
    
    upload(process.env.BUCKET_NAME, key, picture.picture.data).then(async () => {
        await eventModel.findByIdAndUpdate(event.id, { picture_url: process.env.BUCKET_STATIC_URL + key });
    }).catch((err: any) => {
        console.log(err);
    });

    // resize for mobile
    const resizedKey = `event_pictures/${pic_name}--width-400${require('path').extname(picture.picture.name)}`;
    await resizeAndUpload(resizedKey, picture.picture.data, { width: 400 });

    return process.env.BUCKET_STATIC_URL + key;
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