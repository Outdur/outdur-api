import express, { Request, Response } from "express";
const userService = require("./userService");
const httpResponse = require("../helpers/httpResponse");
const authenticate = require('../middleware/verifyToken');
const {findOne, generateUserToken} = require('./userService');


export const userRouter = express.Router();


// list users interests
userRouter.get('/interests', authenticate, async (req: Request, res: Response) => {
    try {
        const userinterests = await userService.listUserInterests(req.user.user_id);
        httpResponse.send(res, 200, null, { interests: userinterests.interests.map((interest: any) => interest.activity_title) });
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});


// update user interests
userRouter.put('/interests', authenticate, async (req: Request, res: Response) => {
    try {
        req.body.user_id = req.user.user_id;
        await userService.updateInterest(req.body);
        httpResponse.send(res, 200, 'User Interest updated');
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});


// find one user
userRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const user = await userService.findOne(req.params.id);
        httpResponse.send(res, 200, null, user)
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});


// find many users
userRouter.get('/', async (req: Request, res: Response) => {
    try {
        const users = await userService.find();
        httpResponse.send(res, 200, null, users);
    } catch(err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});


// update user data
userRouter.put('/', authenticate, async (req: Request, res: Response) => {
    try {
        req.body.user = req.user;
        const user = await userService.update(req.body);
        httpResponse.send(res, 200, null, user);
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});
