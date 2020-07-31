import express, { Request, Response } from "express";
const inviteService = require("./service");
const httpResponse = require("../helpers/httpResponse");


export const inviteRouter = express.Router();

inviteRouter.post('/send', async (req: Request, res: Response) => {
    try {
        const response = await inviteService.create(req.body);
        httpResponse.send(res, 201, 'Invitation sent', response);
    } catch(err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});