import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'
import { env } from 'process'
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
const bucketName = env.ATTACHMENT_S3_BUCKET
const URLExpiration = env.S3_URL_EXPIRATION
const imageBucket = new XAWS.S3({
    signatureVersion: "v4",
})
// TODO: Implement the fileStogare logic

export const createAttachmentPresignedUrl = async () => {
    const imageId = uuid.v4()
    const signedURL = await imageBucket.getSignedUrl("putObject", {
        Bucket: bucketName,
        Key: imageId,
        Expires: URLExpiration,
    });
    return signedURL;
}