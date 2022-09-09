import { VehicleAccess } from '../dataLayer/vehiclesAccess'
import { VehicleItem } from '../models/VehicleItem'
import { CreateVehicleRequest } from '../requests/CreateVehicleRequest'
import { UpdateVehicleRequest } from '../requests/updateVehicleRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const logger = createLogger('vehiclesBussinessLogic')
const vehicleAccess = new VehicleAccess()

export const getVehicles = async (userId: string): Promise<VehicleItem[]> => {
    return await vehicleAccess.getVehicles(userId);
}

export const createVehicle = async (userId: string, vehicle: CreateVehicleRequest): Promise<VehicleItem> => {
    logger.log('info', 'Received vehicle create request: '.concat(JSON.stringify(vehicle)))
    const vehicleId = uuid.v4();
    const newVehicle: VehicleItem = {
        ...vehicle,
        userId,
        vehicleId,
        createdAt: new Date().toISOString()
    }
    await vehicleAccess.createVehicle(newVehicle);
    return newVehicle;
}

export const updateVehicle = async (userId: string, vehicleId: string, updatedvehicle: UpdateVehicleRequest): Promise<void> => {
    await vehicleAccess.updateVehicle(userId, vehicleId, updatedvehicle)
}

export const deleteVehicle = async (userId: string, vehicleId: string): Promise<void> => {
    await vehicleAccess.deleteVehicle(userId, vehicleId)
}

export const generateUploadURL = async (userId: string, vehicleId: string): Promise<string> => {
    const url = await vehicleAccess.getUploadURL(userId, vehicleId)
    return url 
}