const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    event_id: { type: String, unique: true },
    title: String,
    description: String,
    venue: String,
    event_date: Date,
    event_tags: { type: String, index: 'text' },
    user_id: { type: String, index: true },
    circle_id: { type: String, index: true },
    picture_url: String,
    comments: [{ type: Schema.Types.ObjectId, ref: 'EventComment' }]
}, { timestamps: true });

const commentSchema = new Schema({
    comment_id: { type: String, unique: true },
    comment: String,
    event_id: { type: String, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export const eventCommentModel = mongoose.model('EventComment', commentSchema);

export const eventModel = mongoose.model('Event', eventSchema);