import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { VehicleItem } from '../models/VehicleItem'
import { UpdateVehicleRequest } from '../requests/UpdateVehicleRequest'
import { getS3PresignUrl } from '../attachment/attachementHelper'
import { String } from 'aws-sdk/clients/batch'
import * as uuid from 'uuid'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('VehiclesAccess')

export class VehicleAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly vehiclesTable = process.env.VEHICLES_TABLE,
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET) { }

    getVehicles = async (userId: string): Promise<VehicleItem[]> => {
        logger.log('info', 'Get registered vehicles for user: '.concat(userId))
        let vehicles: VehicleItem[]
        const result = await this.docClient.query({
            TableName: this.vehiclesTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()
        vehicles = result.Items as VehicleItem[]
        return vehicles
    }

    createVehicle = async (vehicle: VehicleItem): Promise<VehicleItem> => {
        logger.log('info', 'Register new vehicle: '.concat(JSON.stringify(vehicle)))
        await this.docClient.put({
            TableName: this.vehiclesTable,
            Item: vehicle
        }).promise()
        return vehicle
    }

    updateVehicle = async (userId: string, vehicleId: string, updateVehicle: UpdateVehicleRequest): Promise<void> => {
        logger.log('info', 'Update vehicle info: '.concat(JSON.stringify({ ...updateVehicle, userId, vehicleId })))
        await this.docClient.update({
            TableName: this.vehiclesTable,
            Key: {
                "userId": userId,
                "vehicleId": vehicleId
            },
            UpdateExpression: "set #make=:make, model=:model, year=:year color=:color",
            ExpressionAttributeValues: {
                ":make": updateVehicle.make,
                ":model": updateVehicle.model,
                ":year": updateVehicle.year,
                ":color": updateVehicle.color
            }
        }).promise()
    }

    deleteVehicle = async (userId: string, vehicleId: string): Promise<void> => {
        logger.log('info', 'Delete vehicle: '.concat(vehicleId))
        await this.docClient.delete({
            TableName: this.vehiclesTable,
            Key: {
                "userId": userId,
                "vehicleId": vehicleId
            }
        }).promise()
    }

    getUploadURL = async (userId: string, vehicleId: string): Promise<String> => {
        const imageId = uuid.v4()
        const presignedUrl = await getS3PresignUrl(imageId)
        this.docClient.update({
            TableName: this.vehiclesTable,
            Key: {
                vehicleId,
                userId
            },
            UpdateExpression: "set attachmentUrl = :attachmentUrl",
            ExpressionAttributeValues: {
                ":attachmentUrl": `https://${this.bucketName}.s3.amazonaws.com/${imageId}`,
            }
        }, (err, data) => {
            if (err) {
                logger.log('error', 'Generating attachement presigned URL error: '.concat(err.message))
                throw new Error(err.message)
            }
            logger.log('info', 'Created presign URL: '.concat(JSON.stringify(data)))
        })
        return presignedUrl
    }
}