import { Test, TestingModule } from '@nestjs/testing';
import { VehicleResolver } from './vehicle.resolver';
import { VehicleService } from '../../../service/vehicle/vehicle.service';
import { DealershipService } from '../../../service/dealership/dealership.service';
import { ClsModule, ClsService } from 'nestjs-cls';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UnauthorizedException } from '@nestjs/common';
import { Vehicle } from '../../../service/entities/vehicle.entity';
import { ServiceModule } from '../../../service/service.module';
import { PrismaModule } from '../../../prisma/prisma.module';
import { Dealership } from '../../../service/entities/dealership.entity';

describe('VehicleResolver', () => {
  let resolver: VehicleResolver;
  let vehicleService: VehicleService;
  let dealershipService: DealershipService;
  let clsService: ClsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ServiceModule, ClsModule.forRoot(), PrismaModule],
      providers: [VehicleResolver, JwtAuthGuard],
    }).compile();

    resolver = module.get<VehicleResolver>(VehicleResolver);
    vehicleService = module.get<VehicleService>(VehicleService);
    dealershipService = module.get<DealershipService>(DealershipService);
    clsService = module.get<ClsService>(ClsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('vehicle', () => {
    it('should return a vehicle by ID', async () => {
      const vehicle = new Vehicle();
      vehicle.vehicleId = 'vehicle-id';
      vehicle.dealership = { dealershipId: 'dealership-id' } as Dealership;

      jest.spyOn(vehicleService, 'getVehicleById').mockResolvedValue(vehicle);
      jest.spyOn(clsService, 'get').mockReturnValue('dealership-id');
      jest
        .spyOn(dealershipService, 'validateDealershipAccess')
        .mockResolvedValue(true);

      const result = await resolver.vehicle('vehicle-id', 'dealership-id');

      expect(result).toEqual(vehicle);
      expect(vehicleService.getVehicleById).toHaveBeenCalledWith(
        'vehicle-id',
        'dealership-id',
      );
      expect(dealershipService.validateDealershipAccess).toHaveBeenCalledWith(
        'dealership-id',
        'dealership-id',
      );
    });

    it('should throw an UnauthorizedException if access is denied', async () => {
      jest.spyOn(clsService, 'get').mockReturnValue('dealership-id');
      jest
        .spyOn(dealershipService, 'validateDealershipAccess')
        .mockResolvedValue(false);

      await expect(
        resolver.vehicle('vehicle-id', 'dealership-id'),
      ).rejects.toThrow(UnauthorizedException);
      expect(dealershipService.validateDealershipAccess).toHaveBeenCalledWith(
        'dealership-id',
        'dealership-id',
      );
    });
  });

  describe('vehiclesByCriteria', () => {
    it('should return vehicles by criteria', async () => {
      const vehicles = [new Vehicle(), new Vehicle()];
      jest
        .spyOn(vehicleService, 'getVehiclesByCriteria')
        .mockResolvedValue(vehicles);
      jest.spyOn(clsService, 'get').mockReturnValue('dealership-id');
      jest
        .spyOn(dealershipService, 'validateDealershipAccess')
        .mockResolvedValue(true);

      const result = await resolver.vehiclesByCriteria(
        'Toyota',
        'Camry',
        2020,
        'dealership-id',
      );

      expect(result).toEqual(vehicles);
      expect(vehicleService.getVehiclesByCriteria).toHaveBeenCalledWith(
        'dealership-id',
        'Toyota',
        'Camry',
        2020,
      );
      expect(dealershipService.validateDealershipAccess).toHaveBeenCalledWith(
        'dealership-id',
        'dealership-id',
      );
    });

    it('should throw an UnauthorizedException if access is denied', async () => {
      jest.spyOn(clsService, 'get').mockReturnValue('dealership-id');
      jest
        .spyOn(dealershipService, 'validateDealershipAccess')
        .mockResolvedValue(false);

      await expect(
        resolver.vehiclesByCriteria('Toyota', 'Camry', 2020, 'dealership-id'),
      ).rejects.toThrow(UnauthorizedException);
      expect(dealershipService.validateDealershipAccess).toHaveBeenCalledWith(
        'dealership-id',
        'dealership-id',
      );
    });
  });

  describe('createVehicle', () => {
    it('should create a new vehicle', async () => {
      const vehicle = new Vehicle();
      jest.spyOn(vehicleService, 'createVehicle').mockResolvedValue(vehicle);
      jest.spyOn(clsService, 'get').mockReturnValue('dealership-id');
      jest
        .spyOn(dealershipService, 'validateDealershipAccess')
        .mockResolvedValue(true);

      const result = await resolver.createVehicle(
        'Toyota',
        'Camry',
        2020,
        'dealership-id',
      );

      expect(result).toEqual(vehicle);
      expect(vehicleService.createVehicle).toHaveBeenCalledWith(
        'Toyota',
        'Camry',
        2020,
        'dealership-id',
      );
      expect(dealershipService.validateDealershipAccess).toHaveBeenCalledWith(
        'dealership-id',
        'dealership-id',
      );
    });

    it('should throw an UnauthorizedException if access is denied', async () => {
      jest.spyOn(clsService, 'get').mockReturnValue('dealership-id');
      jest
        .spyOn(dealershipService, 'validateDealershipAccess')
        .mockResolvedValue(false);

      await expect(
        resolver.createVehicle('Toyota', 'Camry', 2020, 'dealership-id'),
      ).rejects.toThrow(UnauthorizedException);
      expect(dealershipService.validateDealershipAccess).toHaveBeenCalledWith(
        'dealership-id',
        'dealership-id',
      );
    });
  });

  describe('updateVehicle', () => {
    it('should update a vehicle', async () => {
      const vehicle = new Vehicle();
      jest.spyOn(vehicleService, 'updateVehicle').mockResolvedValue(vehicle);
      jest.spyOn(clsService, 'get').mockReturnValue('dealership-id');
      jest
        .spyOn(dealershipService, 'validateDealershipAccess')
        .mockResolvedValue(true);

      const result = await resolver.updateVehicle(
        'vehicle-id',
        'Toyota',
        'Camry',
        2020,
        'dealership-id',
      );

      expect(result).toEqual(vehicle);
      expect(vehicleService.updateVehicle).toHaveBeenCalledWith(
        'vehicle-id',
        'Toyota',
        'Camry',
        2020,
        'dealership-id',
      );
      expect(dealershipService.validateDealershipAccess).toHaveBeenCalledWith(
        'dealership-id',
        'dealership-id',
      );
    });

    it('should throw an UnauthorizedException if access is denied', async () => {
      jest.spyOn(clsService, 'get').mockReturnValue('dealership-id');
      jest
        .spyOn(dealershipService, 'validateDealershipAccess')
        .mockResolvedValue(false);

      await expect(
        resolver.updateVehicle(
          'vehicle-id',
          'Toyota',
          'Camry',
          2020,
          'dealership-id',
        ),
      ).rejects.toThrow(UnauthorizedException);
      expect(dealershipService.validateDealershipAccess).toHaveBeenCalledWith(
        'dealership-id',
        'dealership-id',
      );
    });
  });

  describe('deleteVehicle', () => {
    it('should delete a vehicle', async () => {
      const vehicle = new Vehicle();
      jest.spyOn(vehicleService, 'deleteVehicle').mockResolvedValue(vehicle);
      jest.spyOn(clsService, 'get').mockReturnValue('dealership-id');
      jest
        .spyOn(dealershipService, 'validateDealershipAccess')
        .mockResolvedValue(true);

      const result = await resolver.deleteVehicle(
        'vehicle-id',
        'dealership-id',
      );

      expect(result).toEqual(vehicle);
      expect(vehicleService.deleteVehicle).toHaveBeenCalledWith(
        'vehicle-id',
        'dealership-id',
      );
      expect(dealershipService.validateDealershipAccess).toHaveBeenCalledWith(
        'dealership-id',
        'dealership-id',
      );
    });

    it('should throw an UnauthorizedException if access is denied', async () => {
      jest.spyOn(clsService, 'get').mockReturnValue('dealership-id');
      jest
        .spyOn(dealershipService, 'validateDealershipAccess')
        .mockResolvedValue(false);

      await expect(
        resolver.deleteVehicle('vehicle-id', 'dealership-id'),
      ).rejects.toThrow(UnauthorizedException);
      expect(dealershipService.validateDealershipAccess).toHaveBeenCalledWith(
        'dealership-id',
        'dealership-id',
      );
    });
  });
});
