import express, { Request, Response } from "express";
const eventService = require("./service");
const httpResponse = require("../helpers/httpResponse");
const authenticate = require('../middleware/verifyToken');


export const eventRouter = express.Router();

// create event
eventRouter.post('/', authenticate, async (req: Request, res: Response) => {
    try {
        const { event, metadata } = await eventService.create({ ...req.body, user: req.user.id, event_picture: req.files });
        httpResponse.send(res, 201, null, event, metadata);
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message, '', err.data);
    }
});


// find one event
eventRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const event = await eventService.findOne(req.params.id);
        httpResponse.send(res, 200, null, event)
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});


// find events
eventRouter.get('/', authenticate, async (req: Request, res: Response) => {
    try {
        const events = await eventService.find(req.user);
        httpResponse.send(res, 200, null, { events });
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});


// update event
eventRouter.put('/:id', authenticate, async (req: Request, res: Response) => {
    try {
        const { event, metadata } = await eventService.update({ ...req.body, event_id: req.params.id });
        httpResponse.send(res, 200, null, event, metadata);
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});

// delete event
eventRouter.delete('/:event_id', authenticate, async (req: Request, res: Response) => {
    try {
        await eventService.deleteEvent(req.params.event_id);
        httpResponse.send(res, 200);
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});

// post comment
eventRouter.post('/:event_id/comments', authenticate, async (req: Request, res: Response) => {
    try {
        const comment = await eventService.postComment({ ...req.body, event_id: req.params.event_id, user: req.user.id });
        httpResponse.send(res, 200, 'Comment posted', comment);
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});

// list comments
eventRouter.get('/:id/comments', authenticate, async (req: Request, res: Response) => {
    try {
        const comments = await eventService.getComments(req.params.id);
        httpResponse.send(res, 200, 'Comments fetched', { comments });
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});

// list event attendees
eventRouter.get('/:id/invites', authenticate, async (req: Request, res: Response) => {
    try {
        const guests = await eventService.findInvites(req.params.id);
        httpResponse.send(res, 200, 'Event invites fetched', { guests });
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});

// accept or reject event invite
eventRouter.put('/:id/invites', authenticate, async (req: Request, res: Response) => {
    try {
        await eventService.changeInviteStatus(req.body);
        httpResponse.send(res, 200, 'Event invite ' + req.body.status);
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});
