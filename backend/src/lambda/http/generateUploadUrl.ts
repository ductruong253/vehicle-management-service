import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { generateUploadURL } from '../../businessLogic/vehiclesBussinessLogic'
import { getUserId } from '../utils'

const logger = createLogger('generateUploadUrl')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const vehicleId = event.pathParameters.vehicleId
    const userId = getUserId(event)
    // TODO: Return a presigned URL to upload a file for a vehicle item with the provided id
    try {
      const imageURL = await generateUploadURL(userId, vehicleId)
      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ uploadUrl: imageURL })
      }
    } catch (err) {
      logger.log('info', 'Error occurred on generateUploadURL...')
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          from: 'generateUploadURL',
          message: err
        })
      }
    }

    
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
