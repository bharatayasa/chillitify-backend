const path = require('path');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const fs = require('fs');

const storage = new Storage({
    keyFilename: path.join(__dirname, '../../key-bucket/chilitify-433503-a1ea573aab92.json'),
    projectId: 'chilitify-433503'
});

const bucketName = 'image_chillitify'; 
const bucket = storage.bucket(bucketName);

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: multerStorage });

const uploadToGCP = async (req, res, next) => {
    if (!req.file) {
        return res.status(404).json({ message: 'No file uploaded' });
    }

    try {
        const localFilePath = req.file.path;
        const destination = `uploads/${req.file.filename}`;

        await bucket.upload(localFilePath, {
            destination,
            public: true
        });

        req.file.gcpUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;

        fs.unlinkSync(localFilePath);

        next();
    } catch (error) {
        console.error('Error uploading to GCP:', error);
        return res.status(500).json({ message: 'Error uploading file to GCP', error });
    }
};

module.exports = {
    uploadFile: upload.single('file'),
    uploadToGCP
};
