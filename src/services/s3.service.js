const AWS = require("aws-sdk");
const fs = require("fs");
const {s3: {bucket, region, aws_access_key, aws_secret_key}} = require('../configs/config')

const updateConfig = () => {
    AWS.config.update({
        accessKeyId: aws_access_key,
        secretAccessKey: aws_secret_key,
        region: region
    });
}

const uploadFile = async (file) => {
    try {
        updateConfig();

        const imageRemoteName = `directUpload_catImage_${new Date().getTime()}.jpeg`;
        let uploadPromise = await new AWS.S3().putObject({
            Bucket: bucket,
            Body: fs.readFileSync(file),
            Key: imageRemoteName
        }).promise();
        console.log("Successfully uploaded data to bucket");
        return uploadPromise
    } catch (e) {
        console.log("Error uploadFile data: ", e);
    }
}

const downloadFile = async (pathFile, res) => {
    try {
        updateConfig();

        const s3 = new AWS.S3();
        const params = {
            Bucket: bucket,
            Key: pathFile
        };
        const readStream = s3.getObject(params).createReadStream();
        readStream.pipe(res);
    } catch (e) {
        console.log("Error downloadFile data: ", e);
    }
}