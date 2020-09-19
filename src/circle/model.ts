const MUUID = require('uuid-mongodb');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const circleSchema = new Schema({
    circle_id: { type: String, default: MUUID.v4(), unique: true },
    name: String,
    description: String,
    type: { type: String, default: 'Unregistered' },
    photo_url: String,
    user_id: { type: String, index: true },
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }]
}, { timestamps: true });

export const circleModel = mongoose.model('Circle', circleSchema); 

const circleMemberSchema = new Schema({
    member_id: { type: String, unique: true },
    circle_id: { type: String, index: true },
    member: { type: Schema.Types.ObjectId, ref: 'User' },
    invite: { type: Schema.Types.ObjectId, ref: 'Invite' },
    status: { type: String, default: 'Pending' }
}, { timestamps: true });

export const circleMemberModel = mongoose.model('CircleMember', circleMemberSchema);