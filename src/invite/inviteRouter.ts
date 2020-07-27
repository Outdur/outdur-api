import express, { Request, Response } from "express";
const inviteService = require("./inviteService");
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

// // find one user
// inviteRouter.get('/:id', async (req: Request, res: Response) => {
//     try {
//         const user = await inviteService.findOne(1);
//         res.status(200).json(user);
//     } catch(err) {

//     }
// });


// // find many users
// inviteRouter.get('/', async (req: Request, res: Response) => {
//     const users = await inviteService.findAll();
//     res.status(200).send(users);
// });


// // update user
// inviteRouter.put('/:id', async (req: Request, res, Response) => {
//     const user = await inviteService.update(1);
//     res.status(200).send(user);
// });

//export { inviteRouter };