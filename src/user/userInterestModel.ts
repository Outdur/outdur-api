const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userInterestSchema = new Schema({
    user_id: { type: String, index: true },
    interests: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
}, { timestamps: true });

export const userInterestModel = mongoose.model('UserInterest', userInterestSchema); 