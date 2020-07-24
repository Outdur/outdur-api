import express, { Request, Response } from "express";
const userService = require("./userService");
const httpResponse = require("../helpers/httpResponse");


export const userRouter = express.Router();

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
        const users = await userService.findAll();
        httpResponse.send(res, 200, null, users);
    } catch(err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});


// update user
userRouter.put('/:id', async (req: Request, res: Response) => {
    try {
        req.body.user_id = req.params.id;
        const user = await userService.update(req.body);
        httpResponse.send(res, 200, null, user);
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});