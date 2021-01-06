import { handleError } from "../helpers/handleError";
import { eventModel, eventCommentModel, eventAttendanceModel } from './model';
import { circleModel } from "../circle/model";
import { IEvent, IEvents, IEventComment, IEventComments, IEventInvite, IEventInvites } from './interface';
//import { upload } from '../helpers/awsHelper';
import { upload } from '../helpers/imageHelper';
import { cloudinary } from '../helpers/cloudinary';

const MUUID = require('uuid-mongodb');

const eventFields = '-_id title description venue event_date event_time picture_url event_id createdAt';
const userFields = '-_id firstname lastname user_id thumb';
const inviteFields = '-_id code email phone status createdAt';

const create = async (eventData: any): Promise<IEvent> => {
    const validationError = await validateEvent(eventData);
    if (validationError) throw new handleError(422, validationError);

    const newEvent = await eventModel.create({ ...eventData, event_id: MUUID.v4() });

    if (eventData.event_picture) {
        await uploadPicture(eventData.event_picture, newEvent);
    }

    const event = await eventModel.findById(newEvent.id).populate({ path: 'user', select: userFields }).select(eventFields);
    return event;
}

const findOne = async (event_id: string): Promise<IEvent> => {
    const rawEvent = await eventModel.findOne({ event_id }).populate({ path: 'user', select: userFields }).select(eventFields).lean();
    if (!rawEvent) throw new handleError(404, 'Event not found');

    //const event = rawEvent.sanitize();
    rawEvent.comments = await getComments(event_id);
    return rawEvent;
}

const find = async (): Promise<IEvents> => {
    return eventModel.find().sort('-createdAt').populate({ path: 'user', select: userFields }).select(eventFields);
}

const update = async (event: any): Promise<IEvent> => {
    const event_id = event.event_id;
    const validationError = await validateEvent(event);
    if (validationError) throw new handleError(422, validationError);

    const updatedEvent = await eventModel.findOneAndUpdate({ event_id }, event, { new: true });

    if (event.event_picture) {
        // delete old picture if title changes
        await uploadPicture(event.event_picture, updatedEvent);
    }

    return updatedEvent;
}

const deleteEvent = async (event_id: string) => {
    return eventModel.deleteOne({ event_id });
}

const postComment = async (eventComment: IEventComment): Promise<IEventComment> => {
    const validationError = await validateEventComment(eventComment);
    if (validationError) throw new handleError(422, validationError);

    const comment = await eventCommentModel.create({ ...eventComment, comment_id: MUUID.v4() });
    const event = await eventModel.findOne({ event_id: eventComment.event_id }).populate('comments');
    event.comments.push(comment);
    event.save();

    return eventCommentModel.findById(comment.id)
        .populate({ path: 'user', select: userFields })
        .select('-_id comment comment_id createdAt');;
}

const getComments = async(event_id: String): Promise<IEventComments> => {
    return eventCommentModel.find({ event_id })
        .sort('+createdAt')
        .populate({ path: 'user', select: userFields })
        .select('-_id comment comment_id createdAt');
}


const sendInvites = async (invites: any): Promise<IEventInvite> => {
    return eventAttendanceModel.insertMany(invites, { ordered: false });
}

const findInvites = async (event_id: Number):  Promise<IEventInvites> => {
    return eventAttendanceModel.find({ event_id })
        .sort('-status')
        .populate({ path: 'invitee', select: userFields })
        .populate({ path: 'invite', select: inviteFields })
        .select('-_id attend_id status createdAt');
}

const changeInviteStatus = async ({ attend_id, status }: any) => {
    return eventAttendanceModel.findOneAndUpdate({ attend_id }, { status });
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
    // const key = `event_pictures/${pic_name}${require('path').extname(picture.picture.name)}`;
    
    // aws uploader
    // upload(process.env.BUCKET_NAME, key, picture.picture.data).then(async () => {
    //     await eventModel.findByIdAndUpdate(event.id, { picture_url: process.env.BUCKET_STATIC_URL + key });
    // }).catch((err: any) => {
    //     console.log(err);
    // });

    const { public_id, format, secure_url } = await upload({ file: picture.picture.data, filename: pic_name, folder: 'event-images/' });
    const img_url = `${public_id}.${format}`;
    const picture_url = {
        url: secure_url,
        mobile: cloudinary.url(img_url, { width: 400, height: 350, crop: "fill", secure: true }),
    };
    await eventModel.findByIdAndUpdate(event.id, { picture_url });
    return picture_url;

    // resize for mobile
    // const resizedKey = `event_pictures/${pic_name}--width-400${require('path').extname(picture.picture.name)}`;
    // await resizeAndUpload(resizedKey, picture.picture.data, { width: 400 });

    // return process.env.BUCKET_STATIC_URL + key;
}


module.exports = {
    create,
    findOne,
    find,
    update,
    deleteEvent,
    postComment,
    getComments,
    sendInvites,
    findInvites,
    changeInviteStatus
};