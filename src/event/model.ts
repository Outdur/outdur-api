const MUUID = require('uuid-mongodb');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    event_id: { type: String, default: MUUID.v4(), index: true },
    title: String,
    description: String,
    venue: String,
    event_date: Date,
    event_tags: { type: String, index: 'text' },
    user_id: { type: String, index: true },
    circle_id: { type: String, index: true },
    picture_url: String
}, { timestamps: true });

export const eventModel = mongoose.model('Event', eventSchema);