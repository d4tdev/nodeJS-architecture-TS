const AWS = require("aws-sdk");
const fs = require("fs");
const {s3: {bucket, region, aws_access_key, aws_secret_key}} = require('../configs/config')

const BUCKET = bucket;
const REGION = region;
const ACCESS_KEY = aws_access_key;
const SECRET_KEY = aws_secret_key;
console.log(ACCESS_KEY)
console.log(SECRET_KEY)

const localImage = "./cat.jpeg";
const imageRemoteName = `directUpload_catImage_${new Date().getTime()}.jpeg`;

AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
    region: REGION
});

const s3 = new AWS.S3();

s3.putObject({
    Bucket: BUCKET,
    Body: fs.readFileSync(localImage),
    Key: imageRemoteName
})
    .promise()
    .then(res => {
        console.log(`Upload succeeded - `, res);
    })
    .catch(err => {
        console.log("Upload failed:", err);
    });
