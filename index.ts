import express from "express";
import cors from "cors";
import helmet from "helmet";
require('./db_connection');

import { errorHandler } from "./src/middleware/error";
import { notFoundHandler } from "./src/middleware/notFound";
import { routes as api_doc } from "./docs";
import { userRouter } from "./src/user/userRouter";

require('dotenv').config();

if (!process.env.PORT) {
    process.exit(1);
}

//errorHandler({ message: 'error' }, req)

const PORT: number = parseInt(process.env.PORT as string, 10);

 const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/', express.Router().get("/", (req, res) => res.status(200).json({ message: "Hello, welcome to Outdur API, haha!" })));
app.use('/api/docs', api_doc);
app.use('/users', userRouter);

app.use(errorHandler);
app.use(notFoundHandler);

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

module.exports = server;

// Webpack HMR activation
type ModuleId = string | number;

interface WebpackHotModule {
    exports: import("http").Server;
    hot?: {
        data: any;
        accept(
            dependencies: string[],
            callback?: (updatedDependencies: ModuleId[]) => void,
        ): void;
        accept(dependency: string, callback?: () => void): void;
        accept(errHandler?: (err: Error) => void): void;
        dispose(callback: (data: any) => void): void;
    };
}

declare const module: WebpackHotModule;

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => server.close());
}