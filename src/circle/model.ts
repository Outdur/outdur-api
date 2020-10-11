const mongoose = require('mongoose');
const circleFields = ['_id', 'updatedAt', 'circle_id', '__v', 'user', 'user_id'];

const Schema = mongoose.Schema;

const circleSchema = new Schema({
    circle_id: { type: String, unique: true },
    name: String,
    description: String,
    type: { type: String, default: 'Unregistered' },
    photo_url: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    userId: { type: String, index: true },
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }]
}, { timestamps: true });

circleSchema.methods.sanitize = function() {
    let rawCircles = this.toObject();
    let circles = Array.isArray(this) ? [...rawCircles] : [rawCircles];
    circles.forEach(circle => {
        circleFields.forEach(field => delete circle[field])
    });
    return circles.length === 1 ? circles[0] : circles;
};

export const circleModel = mongoose.model('Circle', circleSchema); 

const circleMemberSchema = new Schema({
    member_id: { type: String, unique: true },
    circle_id: { type: String, index: true },
    member: { type: Schema.Types.ObjectId, ref: 'User' },
    invite: { type: Schema.Types.ObjectId, ref: 'Invite' },
    status: { type: String, default: 'Pending' }
}, { timestamps: true });

export const circleMemberModel = mongoose.model('CircleMember', circleMemberSchema);