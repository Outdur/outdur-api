const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const activitySchema = new Schema({
    activity_title: { type: String, unique: true },
    description: String,
    activity_category: { type: Schema.Types.ObjectId, ref: 'ActivityCategory' },
}, { timestamps: true });

const activityCategorySchema = new Schema({
    category_title: String,
    description: String,
    activities: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
}, { timestamps: true });

export const activityModel = mongoose.model('Activity', activitySchema); 
export const activityCategoryModel = mongoose.model('ActivityCategory', activityCategorySchema); 