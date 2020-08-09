import express, { Request, Response } from "express";
const userService = require("./userService");
const httpResponse = require("../helpers/httpResponse");
const authenticate = require('../middleware/verifyToken');


export const userRouter = express.Router();

// find one user
userRouter.get('/:id', async (req: Request, res: Response) => {
    console.log('otu!')
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

// list users interests
userRouter.get('/interests', async (req: Request, res: Response) => {
    console.log('jhfgkfdjgdf')
    try {
        const userinterests = await userService.listUserInterests(req.user.user_id);
        httpResponse.send(res, 200, null, userinterests);
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