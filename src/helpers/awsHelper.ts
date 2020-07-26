import AWS from 'aws-sdk';
import { handleError } from "../helpers/handleError";

const s3Service = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

export const getObject = async (bucketName: string, key: string) => {
    if (!key) throw new handleError(422, 'key must have a value');

    const params = { Bucket: bucketName, Key: key };
    return s3Service.getObject(params);
};


export const putObject = async (bucketName: string, key: string, body, ContentType: string) => {
    const params = {
        Bucket: bucketName,
        ContentType,
        Key: key,
        Body: body,
    };
        
    return s3Service.putObject(params)
};