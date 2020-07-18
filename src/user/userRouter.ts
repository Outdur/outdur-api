import express, { Request, Response } from "express";
import { IUser } from "./userInterface";
import { IUsers } from "./usersInterface";
const userService = require("./userService");
const { userValidationRules, validate } = require('../middleware/userValidation');

export const userRouter = express.Router();

userRouter.post('/', userValidationRules(), validate, async (req: Request, res: Response) => {
    res.status(201);
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