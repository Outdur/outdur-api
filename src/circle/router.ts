import express, { Request, Response } from "express";
const circleService = require("./service");
const httpResponse = require("../helpers/httpResponse");
const authenticate = require('../middleware/verifyToken');


export const circleRouter = express.Router();

// create circle
circleRouter.post('/', authenticate, async (req: Request, res: Response) => {
    try {
        req.body.user = req.user.id;
        req.body.userId = req.user.user_id;
        const newcircle = await circleService.create({ ...req.body, circle_photo: req.files });
        httpResponse.send(res, 200, null, newcircle)
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});


// find one circle
circleRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const circle = await circleService.findOne(req.params.id);
        httpResponse.send(res, 200, null, circle)
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});


// find circles
circleRouter.get('/', async (req: Request, res: Response) => {
    try {
        const user_id = req.user.user_id;
        const circles = await circleService.findAll(user_id);
        httpResponse.send(res, 200, null, { circles });
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});


// update circle
circleRouter.put('/:id', authenticate, async (req: Request, res: Response) => {
    try {
        req.body.circle_id = req.params.id;
        const circle = await circleService.update(req.body);
        httpResponse.send(res, 200, null, circle);
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});

// accept or reject circle membership invite
circleRouter.put('/:id/invites', authenticate, async (req: Request, res: Response) => {
    try {
        await circleService.changeInviteStatus(req.body);
        httpResponse.send(res, 200, 'Event invite ' + req.body.status);
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});

// fetch circle members
circleRouter.get('/:id/members', authenticate, async (req: Request, res: Response) => {
    try {
        const members = await circleService.findMembers(req.params.id);
        httpResponse.send(res, 200, 'Circle members fetched', { members });
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});

// remove circle member
circleRouter.patch('/:id/members', authenticate, async (req: Request, res: Response) => {
    try {
        const circle_id = req.params.id;
        const circle_admin = req.user.id;
        const member = await circleService.removeMember(circle_admin, circle_id, req.body.member_id);
        httpResponse.send(res, 200, 'Circle member removed', { member });
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});
