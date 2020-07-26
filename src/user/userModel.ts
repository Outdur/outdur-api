const MUUID = require('uuid-mongodb');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    user_id: { type: String, default: MUUID.v4(), index: true },
    firstname: String,
    lastname: String,
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
    photo_url: String
}, { timestamps: true });

export const userModel = mongoose.model('User', userSchema); 