const mongoose = require('mongoose');
const unwantedFields = ['_id', 'updatedAt', 'circle_id', '__v', 'user', 'user_id'];

const Schema = mongoose.Schema;

const circleSchema = new Schema({
    circle_id: { type: String, unique: true },
    name: String,
    description: String,
    type: { type: String, default: 'Unregistered' },
    photo_url: { type: Map, of: String },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    userId: { type: String, index: true },
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    deleted: { type: Boolean, default: false }
}, { timestamps: true });

circleSchema.methods.sanitize = function() {
    let circle = this.toObject();
    unwantedFields.forEach(field => delete circle[field])
    return circle;
};

export const circleModel = mongoose.model('Circle', circleSchema); 

const circleMemberSchema = new Schema({
    member_id: { type: String, unique: true },
    circle_id: { type: String, index: true },
    member: { type: Schema.Types.ObjectId, ref: 'User' },
    invite: { type: Schema.Types.ObjectId, ref: 'Invite' },
    status: { type: String, default: 'Pending' },
    deleted: { type: Boolean, default: false }
}, { timestamps: true });

export const circleMemberModel = mongoose.model('CircleMember', circleMemberSchema);