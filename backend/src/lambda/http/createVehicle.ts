import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateVehicleRequest } from '../../requests/CreateVehicleRequest'
import { getUserId } from '../utils';
import { createVehicle } from '../../businessLogic/vehiclesBussinessLogic'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newVehicle: CreateVehicleRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    try {
      const newCreatedTodo = await createVehicle(userId, newVehicle);
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({item: newCreatedTodo})
    }
    }
    catch (err) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({message: err})
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
