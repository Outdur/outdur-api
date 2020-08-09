const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const activityCategorySchema = new Schema({
    category_title: String,
    description: String,
    activities: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
}, { timestamps: true });

export const activityCategoryModel = mongoose.model('ActivityCategory', activityCategorySchema); 