const AWS = require("aws-sdk");
const {s3: {bucket, region, aws_access_key, aws_secret_key}} = require('./config')

const REGION = region;
const ACCESS_KEY = aws_access_key;
const SECRET_KEY = aws_secret_key;

AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
    region: REGION
});

const s3 = new AWS.S3();

const params = {
    Bucket: bucket
};

const editBucketCORS = () =>
    s3.putBucketCors(
        {
            Bucket: bucket,
            CORSConfiguration: {
                CORSRules: [
                    {
                        AllowedHeaders: ["*"],
                        AllowedMethods: ["PUT", "POST", "DELETE"],
                        AllowedOrigins: ["*"]
                    },
                    {
                        AllowedMethods: ["GET"],
                        AllowedOrigins: ["*"]
                    }
                ]
            }
        },
        err => {
            if (err) console.log(err, err.stack);
            else console.log(`Edit Bucket CORS succeed!`);
        }
    );

s3.createBucket(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else {
        console.log(data);
        editBucketCORS();
    }
});
