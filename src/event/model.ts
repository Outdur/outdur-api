const mongoose = require('mongoose');
// const unwantedFields = ['_id', '__v', 'event_tags', 'user', 'updatedAt'];

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    event_id: { type: String, unique: true },
    title: String,
    description: String,
    venue: String,
    event_date: Date,
    event_time: String,
    event_tags: { type: String, index: 'text' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    event_scope: [{
        scope: String,
        values: [String]
    }],
    circle_id: { type: String, index: true },
    picture_url: { type: Map, of: String },
    comments: [{ type: Schema.Types.ObjectId, ref: 'EventComment' }],
    deleted: { type: Boolean, default: false }
}, { timestamps: true });

// eventSchema.methods.sanitize = function () {
//     let event = this.toObject();
//     unwantedFields.forEach(field => delete event[field]);
//     //console.log(event.picture_url.get('url'))
//     return event;
// };

export const eventModel = mongoose.model('Event', eventSchema);


const commentSchema = new Schema({
    comment_id: { type: String, unique: true },
    comment: String,
    event_id: { type: String, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    deleted: { type: Boolean, default: false }
}, { timestamps: true });

export const eventCommentModel = mongoose.model('EventComment', commentSchema);


const eventGuestSchema = new Schema({
    guest_id: { type: String, unique: true },
    event_id: { type: String, index: true },
    inviter: { type: Schema.Types.ObjectId, ref: 'User' },
    guest: { type: Schema.Types.ObjectId, ref: 'User' },
    invite: { type: Schema.Types.ObjectId, ref: 'Invite' },
    status: { type: String, default: 'Pending' },
    deleted: { type: Boolean, default: false }
}, { timestamps: true });

export const eventGuestModel = mongoose.model('EventAttendance', eventGuestSchema);

