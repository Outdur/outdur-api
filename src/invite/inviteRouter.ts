import express, { Request, Response } from "express";
const inviteService = require('./inviteService');

export const inviteRouter = express.Router();

// send invite
inviteRouter.post('/send', async(req: Request, res: Response) => {
    const inviteData = req.body;
});