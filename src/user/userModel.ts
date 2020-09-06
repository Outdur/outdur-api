const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    user_id: { type: String, unique: true },
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
    photo_url: String,
    thumb: String,
    device_id: { type: String, unique: true },
    device_platform: String
}, { timestamps: true });

export const userModel = mongoose.model('User', userSchema); 