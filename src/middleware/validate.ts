import { Request, Response, NextFunction } from "express";
const { validationResult } = require('express-validator');

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const raw_errors = validationResult(req);

    if (raw_errors.isEmpty()) {
        return next();
    }

    const errors = raw_errors.errors.map((err: { msg: any; }) => ({ message: err.msg }));

    return res.status(422).json({ status: 'error', errors });
};