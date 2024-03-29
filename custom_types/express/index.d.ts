import { IUser } from "./../../src/user/userInterface";

declare global {
    namespace Express {
        export interface Request {
            user: IUser;
            files: Object;
        }
    }

    namespace NodeJS {
        interface Global {
            fixtures: any
        }
    }
}