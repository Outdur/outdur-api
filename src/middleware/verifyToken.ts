const jwt = require('jsonwebtoken');
import { Request, Response, NextFunction } from "express";

module.exports = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.sendStatus(401); // Unauthorized

        jwt.verify(token, process.env.JWT_SECRET, (err: any, payload: any) => {
            if (err) {
                return res.sendStatus(403); // forbidden
            }
            req.user = payload;
            next();
        });
    } catch (err) {
        next(err);
    }
}