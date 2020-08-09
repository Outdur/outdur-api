import express, { Request, Response } from "express";
const inviteService = require("./service");
const httpResponse = require("../helpers/httpResponse");
const authenticate = require('../middleware/verifyToken');


export const inviteRouter = express.Router();

inviteRouter.get('/send', async (req: Request, res: Response) => {
    try {
        const invites = await inviteService.find();
        httpResponse.send(res, 200, null, invites);
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});

inviteRouter.post('/send', authenticate, async (req: Request, res: Response) => {
    try {
        req.body.user = req.user;
        const response = await inviteService.create(req.body);
        httpResponse.send(res, 201, 'Invite sent', response);
    } catch(err) {
        httpResponse.send(res, err.statusCode, err.message, { invalidContacts: err.data || null });
    }
});

inviteRouter.post('/accept', async (req: Request, res: Response) => {
    try {
        const response = await inviteService.acceptInvite(req.body);
        httpResponse.send(res, 200, 'Invita accepted', response);
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});