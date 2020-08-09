import express, { Request, Response } from "express";
const httpResponse = require("../helpers/httpResponse");
import { activityModel, activityCategoryModel } from "./model";

export const activityRouter = express.Router();

activityRouter.get('/', async (req: Request, res: Response) => {
    //await activityModel.deleteMany({});
    try {
        const activities = await activityModel.find({}, ).populate('activity_category');
        httpResponse.send(res, 200, 'Activities fetched', { intersts: activities.map((activity: any) => activity.activity_title) });
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});

// list activity categories
activityRouter.get('/category', async (req: Request, res: Response) => {
    try {
        const categories = await activityCategoryModel.find().populate('activities');
        httpResponse.send(res, 200, 'Activities\' categories  fetched', categories);
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});

// view activity categories
activityRouter.get('/category/:id', async (req: Request, res: Response) => {
    try {
        const categories = await activityCategoryModel.findById(req.params.id).populate('activities');
        httpResponse.send(res, 200, 'Activities\' category  fetched', categories);
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});

// create activity category
activityRouter.post('/category', async (req: Request, res: Response) => {
    try {
        const response = await activityCategoryModel.create(req.body);
        httpResponse.send(res, 200, 'Activity category created', response);
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});

// create new category
activityRouter.post('/', async (req: Request, res: Response) => {
    try {
        const response = await activityModel.create(req.body);
        const category = await activityCategoryModel.findById(req.body.activity_category).populate('activities');
        console.log(category)
        category.activities.push(response);
        category.save();
        httpResponse.send(res, 200, 'Category created', response);
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});