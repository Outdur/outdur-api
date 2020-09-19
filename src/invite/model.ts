const MUUID = require('uuid-mongodb');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const inviteSchema = new Schema({
    email: { type: String, trim: true, index: true },
    phone: { type: String, trim: true, index: true },
    user: { type: String, trim: true, index: true },
    event_id: { type: String, trim: true, index: true },
    circle_id: { type: String, trim: true, index: true },
    code:  { type: String, trim: true, index: true },
    status: { type: String, default: 'Pending' }
}, { timestamps: true });

export const inviteModel = mongoose.model('Invite', inviteSchema); 