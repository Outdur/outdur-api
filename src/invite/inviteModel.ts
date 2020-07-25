const MUUID = require('uuid-mongodb');
//const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const inviteSchema = new Schema({
    id: { type: String, default: MUUID.v4() },
    email: {
        type: String, trim: true, index: {
            unique: true,
            partialFilterExpression: { email: { $type: "string" } }
        }
    },
    phone: {
        type: String, trim: true, index: {
            unique: true,
            partialFilterExpression: { phone: { $type: "string" } }
        }
    },
    code: Number,
    user: Number,
    event_id: String,
    circle_id: String,
    status: String
}, { timestamps: true });

exports.inviteModel = mongoose.model('Invite', inviteSchema);