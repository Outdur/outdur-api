const mongoose = require('mongoose');

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
    circle_id: { type: String, index: true },
    picture_url: String,
    comments: [{ type: Schema.Types.ObjectId, ref: 'EventComment' }]
}, { timestamps: true });

export const eventModel = mongoose.model('Event', eventSchema);


const commentSchema = new Schema({
    comment_id: { type: String, unique: true },
    comment: String,
    event_id: { type: String, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export const eventCommentModel = mongoose.model('EventComment', commentSchema);


const eventAttendanceSchema = new Schema({
    event_attendance_id: { type: String, unique: true },
    event_id: { type: String, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    email: { type: String, index: true },
    phone: { type: StorageManager, index: true },
    status: { type: String, default: 'Pending' }
}, { timestamps: true });

export const eventAttendanceModel = mongoose.model('EventAttendance', eventAttendanceSchema);