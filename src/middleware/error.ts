import HttpException from "../common/http-exception";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
    error: HttpException,
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const status = error.statusCode || 500;
    const message =
        error.message || "Opp!. Something went south.";

    response.status(status).send(message);
};