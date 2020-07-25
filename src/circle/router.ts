import express, { Request, Response } from "express";
const circleService = require("./service");
const httpResponse = require("../helpers/httpResponse");


export const circleRouter = express.Router();

// create circle
circleRouter.post('/', async (req: Request, res: Response) => {
    try {
        const newcircle = await circleService.create(req.body);
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


// find many circles
circleRouter.get('/', async (req: Request, res: Response) => {
    try {
        const circles = await circleService.findAll();
        httpResponse.send(res, 200, null, circles);
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});


// update circle
circleRouter.put('/:id', async (req: Request, res: Response) => {
    try {
        req.body.circle_id = req.params.id;
        const circle = await circleService.update(req.body);
        httpResponse.send(res, 200, null, circle);
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});