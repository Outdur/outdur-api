import express, { Request, Response } from "express";
import { IUser } from "./userInterface";
import { IUsers } from "./usersInterface";
const userService = require("./userService");

export const userRouter = express.Router();

// create user
userRouter.post('/', async (req: Request, res: Response) => {
    const newUser = await userService.create({});
    res.status(201).json(newUser);
});


// find one user
userRouter.get('/:id', async (req: Request, res: Response) => {
    const user = await userService.findOne(1);
    res.status(200).json(user);
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