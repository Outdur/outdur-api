export const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CD_NAME, 
    api_key: process.env.CD_API_KEY, 
    api_secret: process.env.CD_API_SECRET
});

export const upload = async ({ file, filename, folder }) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ public_id: filename, folder }, (err, res) => {
        if (err) {
          return reject(err);
        } 
          
        return resolve(res);
      }).end(file);
    });
}