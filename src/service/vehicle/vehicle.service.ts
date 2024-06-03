import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Vehicle } from '../entities/vehicle.entity';

@Injectable()
export class VehicleService {
  private readonly logger = new Logger(VehicleService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new vehicle in the specified dealership.
   * @param make - The make of the vehicle.
   * @param model - The model of the vehicle.
   * @param year - The year of the vehicle.
   * @param dealershipId - The dealership ID where the vehicle belongs.
   * @returns Promise<Vehicle> - The created vehicle.
   */
  async createVehicle(
    make: string,
    model: string,
    year: number,
    dealershipId: string,
  ): Promise<Vehicle> {
    this.logger.log(
      `Creating vehicle: ${make} ${model} ${year} in dealership ID: ${dealershipId}`,
    );
    const vehicle = await this.prisma.vehicle.create({
      data: { make, model, year, dealershipId },
    });
    return this.getVehicleById(vehicle.vehicleId, dealershipId);
  }

  /**
   * Retrieves a vehicle by its ID.
   * @param vehicleId - The ID of the vehicle.
   * @param dealershipId - The dealership ID where the vehicle belongs.
   * @returns Promise<Vehicle | null> - The vehicle or null if not found.
   */
  async getVehicleById(
    vehicleId: string,
    dealershipId: string,
  ): Promise<Vehicle | null> {
    this.logger.log(`Fetching vehicle ID: ${vehicleId}`);
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { vehicleId, dealershipId },
      include: { sales: true, dealership: true },
    });
    return vehicle as unknown as Vehicle | null;
  }

  /**
   * Retrieves vehicles by a combination of make, model, and year.
   * @param make - The make of the vehicles to search for.
   * @param model - The model of the vehicles to search for.
   * @param year - The year of the vehicles to search for.
   * @param dealershipId - The dealership ID where the vehicles belong.
   * @returns Promise<Vehicle[]> - A list of vehicles matching the criteria.
   */
  async getVehiclesByCriteria(
    dealershipId: string,
    make?: string,
    model?: string,
    year?: number,
  ): Promise<Vehicle[]> {
    this.logger.log(
      `Fetching vehicles with criteria: make=${make}, model=${model}, year=${year}, dealershipId=${dealershipId}`,
    );
    const conditions: any = {};
    if (make) {
      conditions.make = { contains: make };
    }
    if (model) {
      conditions.model = { contains: model };
    }
    if (year) {
      conditions.year = year;
    }
    conditions.dealershipId = dealershipId;
    return this.prisma.vehicle.findMany({
      where: conditions,
      include: { sales: true, dealership: true },
    }) as unknown as Vehicle[];
  }

  /**
   * Updates an existing vehicle's information.
   * @param vehicleId - The ID of the vehicle to update.
   * @param make - The updated make of the vehicle.
   * @param model - The updated model of the vehicle.
   * @param year - The updated year of the vehicle.
   * @param dealershipId - The dealership ID where the vehicle belongs.
   * @returns Promise<Vehicle> - The updated vehicle.
   */
  async updateVehicle(
    vehicleId: string,
    make: string,
    model: string,
    year: number,
    dealershipId: string,
  ): Promise<Vehicle> {
    this.logger.log(
      `Updating vehicle ID: ${vehicleId} in dealership ID: ${dealershipId}`,
    );
    const vehicle = await this.prisma.vehicle.update({
      where: { vehicleId },
      data: { make, model, year, dealershipId },
    });
    return vehicle as unknown as Vehicle;
  }

  /**
   * Deletes a vehicle by its ID.
   * @param vehicleId - The ID of the vehicle to delete.
   * @param dealershipId - The dealership ID where the vehicle belongs.
   * @returns Promise<Vehicle> - The deleted vehicle.
   */
  async deleteVehicle(
    vehicleId: string,
    dealershipId: string,
  ): Promise<Vehicle> {
    this.logger.log(`Deleting vehicle ID: ${vehicleId}`);
    const vehicle = await this.prisma.vehicle.delete({
      where: { vehicleId, dealershipId },
    });
    return vehicle as unknown as Vehicle;
  }
}
