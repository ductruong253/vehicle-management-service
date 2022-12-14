/**
 * Fields in a request to create a single vehicle item.
 */
export interface CreateVehicleRequest {
  make: string
  model: string
  year: string
  color: string
  VIN: string
}
