import express, { Request, Response } from "express";
const userService = require("./userService");
const httpResponse = require("../helpers/httpResponse");


export const userRouter = express.Router();

userRouter.post('/', async (req: Request, res: Response) => {
    try {
        const response = await userService.create(req.body);
        httpResponse.send(res, 201, 'User created', response);
    } catch(err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});

// find one user
userRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const user = await userService.findOne(1);
        res.status(200).json(user);
    } catch(err) {

    }
});


// find many users
userRouter.get('/', async (req: Request, res: Response) => {
    const users = await userService.findAll();
    res.status(200).send(users);
});


// update user
userRouter.put('/:id', async (req: Request, res, Response) => {
    const user = await userService.update(1);
    res.status(200).send(user);
});

//export { userRouter };