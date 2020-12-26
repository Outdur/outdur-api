import express from "express";
const fileUpload = require('express-fileupload');
require('dotenv').config();

import { errorHandler } from "../src/middleware/error";
import { notFoundHandler } from "../src/middleware/notFound";
import { userRouter } from "../src/user/userRouter";
import { eventRouter } from "../src/event/router";
import { circleRouter } from "../src/circle/router";
import { imgServiceRouter } from "../src/helpers/imageHelper";
import { inviteRouter } from "../src/invite/router";
import { activityRouter } from "../src/activity/router";

if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(fileUpload());

app.use('/users', userRouter);
app.use('/events', eventRouter);
app.use('/circles', circleRouter);
app.use('/invites', inviteRouter);
app.use('/media', imgServiceRouter);
app.use('/interests', activityRouter);

app.use(errorHandler);
app.use(notFoundHandler);

const testServer = app.listen(PORT, () => {
    console.log(`Listening on test port ${PORT}`);
});

module.exports = testServer;