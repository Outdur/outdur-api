const MUUID = require('uuid-mongodb');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const circleSchema = new Schema({
    circle_id: { type: String, default: MUUID.v4(), index: true },
    name: String,
    description: String,
    type: String,
    user_id: { type: String, index: true },
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }]
}, { timestamps: true });

export const circleModel = mongoose.model('Circle', circleSchema); 