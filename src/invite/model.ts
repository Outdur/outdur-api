const MUUID = require('uuid-mongodb');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const inviteSchema = new Schema({
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
    user: {
        type: String, trim: true, index: {
            unique: true,
            partialFilterExpression: { phone: { $type: "string" } }
        }
    },
    event_id: {
        type: String, trim: true, index: {
            unique: true,
            partialFilterExpression: { phone: { $type: "string" } }
        }
    },
    circle_id: {
        type: String, trim: true, index: {
            unique: true,
            partialFilterExpression: { phone: { $type: "string" } }
        }
    },
    code: String,
    status: String
}, { timestamps: true });

export const inviteModel = mongoose.model('Invite', inviteSchema); 