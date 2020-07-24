import { Response } from "express";

const send = (res: Response, statusCode: any, message: string | null, data: object | null) => {
    let response: any = {
        status: true,
    }

    if (data) response.data = data

    statusCode = statusCode || 500;
    if (statusCode > 299) response = { ...response, status: false, error: { code: statusCode, message }};

    return res.status(statusCode).json(response);
}

module.exports = {
    send
};