import HttpException from "../common/http-exception";

export class handleError extends HttpException {
    constructor(statusCode: number, message: string) {
        super(statusCode, message);
        this.statusCode = statusCode;
        this.message = message;
    }
}