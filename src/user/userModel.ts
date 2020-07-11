const MUUID = require('uuid-mongodb');
//const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    user_id: { type: String, default: MUUID.v4() },
    firstname: String,
    lastname: String,
    email: String,
    phone: String
}, { timestamps: true });

exports.userModel = mongoose.model('User', userSchema);