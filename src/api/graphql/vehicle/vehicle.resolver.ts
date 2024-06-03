import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Vehicle } from '../../../service/entities/vehicle.entity';
import { VehicleService } from '../../../service/vehicle/vehicle.service';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ClsService } from 'nestjs-cls';
import { DealershipService } from '../../../service/dealership/dealership.service';

@Resolver(() => Vehicle)
@UseGuards(JwtAuthGuard)
export class VehicleResolver {
  constructor(
    private readonly vehicleService: VehicleService,
    private readonly dealershipService: DealershipService,
    private readonly clsService: ClsService,
  ) {}

  /**
   * Retrieves a vehicle by its ID.
   * @param vehicleId - The ID of the vehicle to retrieve.
   * @param dealershipId - Optional ID of the dealership to validate access.
   * @returns The vehicle matching the ID.
   */
  @Query(() => Vehicle, {
    nullable: true,
    description: 'Retrieves a vehicle by its ID.',
  })
  async vehicle(
    @Args('id', { type: () => ID }) vehicleId: string,
    @Args('dealershipId', { type: () => ID, nullable: true })
    dealershipId?: string,
  ): Promise<Vehicle | null> {
    const userDealershipId = this.clsService.get('dealershipId');
    if (!dealershipId) {
      dealershipId = userDealershipId;
    } else {
      const hasAccess = await this.dealershipService.validateDealershipAccess(
        userDealershipId,
        dealershipId,
      );
      if (!hasAccess) {
        throw new UnauthorizedException();
      }
    }
    return this.vehicleService.getVehicleById(vehicleId, dealershipId);
  }

  /**
   * Retrieves vehicles by a combination of make, model, and year.
   * @param make - Optional make of the vehicles to search for.
   * @param model - Optional model of the vehicles to search for.
   * @param year - Optional year of the vehicles to search for.
   * @param dealershipId - Optional ID of the dealership to validate access.
   * @returns A list of vehicles matching the criteria.
   */
  @Query(() => [Vehicle], {
    description:
      'Retrieves vehicles by a combination of make, model, and year.',
  })
  async vehiclesByCriteria(
    @Args('make', { type: () => String, nullable: true }) make?: string,
    @Args('model', { type: () => String, nullable: true }) model?: string,
    @Args('year', { type: () => Int, nullable: true }) year?: number,
    @Args('dealershipId', { type: () => ID, nullable: true })
    dealershipId?: string,
  ): Promise<Vehicle[]> {
    const userDealershipId = this.clsService.get('dealershipId');
    if (!dealershipId) {
      dealershipId = userDealershipId;
    } else {
      const hasAccess = await this.dealershipService.validateDealershipAccess(
        userDealershipId,
        dealershipId,
      );
      if (!hasAccess) {
        throw new UnauthorizedException();
      }
    }
    return this.vehicleService.getVehiclesByCriteria(
      dealershipId,
      make,
      model,
      year,
    );
  }

  /**
   * Creates a new vehicle.
   * @param make - The make of the vehicle.
   * @param model - The model of the vehicle.
   * @param year - The year of the vehicle.
   * @param dealershipId - Optional ID of the dealership to validate access.
   * @returns The created vehicle.
   */
  @Mutation(() => Vehicle, { description: 'Creates a new vehicle.' })
  async createVehicle(
    @Args('make') make: string,
    @Args('model') model: string,
    @Args('year', { type: () => Int }) year: number,
    @Args('dealershipId', { type: () => ID, nullable: true })
    dealershipId?: string,
  ): Promise<Vehicle> {
    const userDealershipId = this.clsService.get('dealershipId');
    if (!dealershipId) {
      dealershipId = userDealershipId;
    } else {
      const hasAccess = await this.dealershipService.validateDealershipAccess(
        userDealershipId,
        dealershipId,
      );
      if (!hasAccess) {
        throw new UnauthorizedException();
      }
    }
    return this.vehicleService.createVehicle(make, model, year, dealershipId);
  }

  /**
   * Updates an existing vehicle.
   * @param vehicleId - The ID of the vehicle to update.
   * @param make - The updated make of the vehicle.
   * @param model - The updated model of the vehicle.
   * @param year - The updated year of the vehicle.
   * @param dealershipId - Optional ID of the dealership to validate access.
   * @returns The updated vehicle.
   */
  @Mutation(() => Vehicle, { description: 'Updates an existing vehicle.' })
  async updateVehicle(
    @Args('vehicleId', { type: () => ID }) vehicleId: string,
    @Args('make') make: string,
    @Args('model') model: string,
    @Args('year', { type: () => Int }) year: number,
    @Args('dealershipId', { type: () => ID, nullable: true })
    dealershipId?: string,
  ): Promise<Vehicle> {
    const userDealershipId = this.clsService.get('dealershipId');
    if (!dealershipId) {
      dealershipId = userDealershipId;
    } else {
      const hasAccess = await this.dealershipService.validateDealershipAccess(
        userDealershipId,
        dealershipId,
      );
      if (!hasAccess) {
        throw new UnauthorizedException();
      }
    }
    return this.vehicleService.updateVehicle(
      vehicleId,
      make,
      model,
      year,
      dealershipId,
    );
  }

  /**
   * Deletes a vehicle by its ID.
   * @param vehicleId - The ID of the vehicle to delete.
   * @param dealershipId - Optional ID of the dealership to validate access.
   * @returns The deleted vehicle.
   */
  @Mutation(() => Vehicle, { description: 'Deletes a vehicle by its ID.' })
  async deleteVehicle(
    @Args('vehicleId', { type: () => ID }) vehicleId: string,
    @Args('dealershipId', { type: () => ID, nullable: true })
    dealershipId?: string,
  ): Promise<Vehicle> {
    const userDealershipId = this.clsService.get('dealershipId');
    if (!dealershipId) {
      dealershipId = userDealershipId;
    } else {
      const hasAccess = await this.dealershipService.validateDealershipAccess(
        userDealershipId,
        dealershipId,
      );
      if (!hasAccess) {
        throw new UnauthorizedException();
      }
    }
    return this.vehicleService.deleteVehicle(vehicleId, dealershipId);
  }
}
