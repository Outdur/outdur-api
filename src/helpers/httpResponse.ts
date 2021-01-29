import { Response } from "express";

const send = (res: Response, statusCode: any, message: string | null, data?: object, metadata?: object) => {
    let response: any = {
        status: true,
    }

    if (data) response.data = data
    if (metadata) response.metadata = metadata;

    statusCode = statusCode || 500;
    if (statusCode > 299) response = { status: false, error: { code: statusCode, message }, ...response };

    return res.status(statusCode).json(response);
}

module.exports = {
    send
};