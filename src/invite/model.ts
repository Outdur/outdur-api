const MUUID = require('uuid-mongodb');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const inviteSchema = new Schema({
    email: {
        type: String, trim: true, index: {
            partialFilterExpression: { email: { $type: "string" } }
        }
    },
    phone: {
        type: String, trim: true, index: {
            partialFilterExpression: { phone: { $type: "string" } }
        }
    },
    user: {
        type: String, trim: true, index: {
            partialFilterExpression: { user: { $type: "string" } }
        }
    },
    event_id: {
        type: String, trim: true, index: {
            partialFilterExpression: { event_id: { $type: "string" } }
        }
    },
    circle_id: {
        type: String, trim: true, index: {
            partialFilterExpression: { circle_id: { $type: "string" } }
        }
    },
    code:  {
        type: String, trim: true, index: {
            partialFilterExpression: { circle_id: { $type: "string" } }
        }
    },
    status: String
}, { timestamps: true });

export const inviteModel = mongoose.model('Invite', inviteSchema); 