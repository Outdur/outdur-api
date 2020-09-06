import express from "express";
import { handleError } from "./handleError";
const httpResponse = require("./httpResponse");

import sharp from 'sharp';
import { getObject, upload, putObject } from './awsHelper';

export const imgServiceRouter = express.Router();

imgServiceRouter.get("/notfound", async (req, res) => {
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
        const { Body, ContentType } = await getObject(process.env.BUCKET_NAME, originalFilename);

        const image = Buffer.from(Body);
        const convertedImageBuffer = await sharpImageConverter(image, tasks);
        await putObject(process.env.BUCKET_NAME, imgUrl, convertedImageBuffer, ContentType);
        return res.redirect(`${process.env.BUCKET_STATIC_URL}/${imgUrl}`);
    } catch (err) {
        httpResponse.send(res, err.statusCode, err.message);
    }
});

const sharpImageConverter = async (image, options) => {
    const resizedImage = await sharp(image).resize(options).sharpen(0.5).toBuffer();
    return resizedImage;
}

export const resizeAndUpload = async (key, imageData, options) => {
    const resizedImage = await sharpImageConverter(imageData, options);
    upload(process.env.BUCKET_NAME, key, resizedImage);
}