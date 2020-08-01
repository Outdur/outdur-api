import express from "express";
import { handleError } from "./handleError";
const httpResponse = require("./httpResponse");

import sharp from 'sharp';
import { getObject, putObject } from './awsHelper';

export const imgServiceRouter = express.Router();

imgServiceRouter.get("/notfound", async (req, res) => {
    const bucketName = 'outdoor-imgs';
    const bucketUrl = 'https://outdoor-imgs.s3.us-east-2.amazonaws.com';

    try {
        const imgUrl = req.query.url;
        if (!imgUrl) throw new handleError(404, 'Image URL not found');

        const acceptedFileExtensions = /\.(jpg|jpeg|png)$/i;
        if (!acceptedFileExtensions.test(imgUrl)) throw new handleError(400, 'Image type is not acceptable');

        const acceptedTasks = ['width'];
        const [imgFilename, fileExtension] = imgUrl.split('.');
        const splittedFilenameByTasks = imgFilename.split('--');
        if (splittedFilenameByTasks.length === 1) throw new handleError(400, 'There\'s nothing to do here');

        const tasks = {}
        splittedFilenameByTasks.splice(1).forEach((task) => {
            const [key, value] = task.split('-');
            if (!acceptedTasks.includes(key)) throw new handleError(400, 'This operation is not allowed');
            tasks[key] = parseInt(value, 10);
            return
        });

        // download the original image
        const originalFilename = `${splittedFilenameByTasks[0]}.${fileExtension}`;
        const { Body, ContentType } = await getObject(bucketName, originalFilename);

        const image = Buffer.from(Body);
        const convertedImageBuffer = await sharpImageConverter(image, tasks);
        await putObject(bucketName, imgUrl, convertedImageBuffer, ContentType);
        return res.redirect(`${bucketUrl}/${imgUrl}`);
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});

const sharpImageConverter = async (image, options) => {
    const resizedImage = await sharp(image).resize(options).sharpen(0.5).toBuffer();
    return resizedImage;
}