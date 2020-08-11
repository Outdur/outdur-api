import express, { Request, Response } from "express";
const eventService = require("./service");
const httpResponse = require("../helpers/httpResponse");
const authenticate = require('../middleware/verifyToken');


export const eventRouter = express.Router();

// create event
eventRouter.post('/', authenticate, async (req: Request, res: Response) => {
    try {
        const newEvent = await eventService.create(req.body, req.user);
        httpResponse.send(res, 201, null, newEvent)
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});


// find one event
eventRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const event = await eventService.findOne(req.params.id);
        httpResponse.send(res, 201, null, event)
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});

// find user events
eventRouter.get('/user', authenticate, async (req: Request, res: Response) => {
    try {
        const events = await eventService.findUserEvents(req.user);
        httpResponse.send(res, 200, null, events)
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});


// find many events
eventRouter.get('/', async (req: Request, res: Response) => {
    try {
        const events = await eventService.findAll();
        httpResponse.send(res, 200, null, events);
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});


// update event
eventRouter.put('/:id', async (req: Request, res: Response) => {
    try {
        req.body.event_id = req.params.id;
        const event = await eventService.update(req.body);
        httpResponse.send(res, 200, null, event);
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});
