const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const {
    getSignedUrl,
} = require('@aws-sdk/s3-request-presigner');
const {nanoid} = require("nanoid");

class StorageService {
    constructor() {
        this._S3 = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
    }

    async writeFile(file, meta) {
        const id = nanoid(8);
        const parameter = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: id + '-' + meta.filename,
            Body: file._data,
            ContentType: meta.headers['content-type'],
        });

        return new Promise((resolve, reject) => {
            const url = this.createPreSignedUrl({
                bucket: process.env.AWS_BUCKET_NAME,
                key: id + '-' + meta.filename,
            });
            this._S3.send(parameter, (error) => {
                if (error) {
                    return reject(error);
                }

                return resolve(url);
            });
        });
    }

    createPreSignedUrl({ bucket, key }) {
        const command = new GetObjectCommand({ Bucket: bucket, Key: key });
        return getSignedUrl(this._S3, command, { expiresIn: 3600 });
    }
}

module.exports = StorageService;