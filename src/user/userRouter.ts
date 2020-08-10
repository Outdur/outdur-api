import express, { Request, Response } from "express";
const userService = require("./userService");
const httpResponse = require("../helpers/httpResponse");
const authenticate = require('../middleware/verifyToken');
const {findOne, generateUserToken} = require('./userService');


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
userRouter.put('/:id', authenticate, async (req: Request, res: Response) => {
    try {
        req.body.user_id = req.params.id;
        const user = await userService.update(req.body);
        httpResponse.send(res, 200, null, user);
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});

//generate token for dev.
userRouter.post('/', async (req: Request, res: Response) => {
    try {
        const user = await findOne("af9f2267-758a-4e17-8f47-e6c5d8d09cff");
        // console.log(user);
        const token = await generateUserToken(user);
        httpResponse.send(res, 200, null, token);
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});