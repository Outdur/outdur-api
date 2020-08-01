import AWS from 'aws-sdk';
import { handleError } from "./handleError";

const s3Service = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

export const getObject = async (bucketName, key) => {
    if (!key) throw new handleError(422, 'key must have a value');

    const params = { Bucket: bucketName, Key: key };
    console.log(params)
    return new Promise((resolve, reject) => {
        s3Service.getObject(params, (err, data) => {
            if (err) return reject(err);
            return resolve(data);
        });
    });
};


export const putObject = async (bucketName, key, body, ContentType) => {
    const params = {
        Bucket: bucketName,
        ContentType,
        Key: key,
        Body: body,
    };
        
    return new Promise((resolve, reject) => {
        s3Service.putObject(params, (err, data) => {
        if (err) reject(err)
            return resolve(data);
        });
    });
};