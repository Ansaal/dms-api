import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { VehicleService } from './vehicle.service';

const mockPrismaService = {
  vehicle: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('VehicleService', () => {
  let service: VehicleService;
  let prisma: PrismaService;

  beforeEach(async () => {
    jest.restoreAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createVehicle', () => {
    it('should create a new vehicle and return it', async () => {
      const vehicleData = {
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        dealershipId: 'dealership-id',
      };
      const createdVehicle = { ...vehicleData, vehicleId: 'vehicle-id' };

      (prisma.vehicle.create as jest.Mock).mockResolvedValue(createdVehicle);
      (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue(
        createdVehicle,
      );

      const result = await service.createVehicle(
        vehicleData.make,
        vehicleData.model,
        vehicleData.year,
        vehicleData.dealershipId,
      );

      expect(result).toEqual(createdVehicle);
      expect(prisma.vehicle.create).toHaveBeenCalledWith({
        data: vehicleData,
      });
      expect(prisma.vehicle.findUnique).toHaveBeenCalledWith({
        where: {
          vehicleId: createdVehicle.vehicleId,
          dealershipId: vehicleData.dealershipId,
        },
        include: { sales: true, dealership: true },
      });
    });
  });

  describe('getVehicleById', () => {
    it('should return a vehicle by its ID', async () => {
      const vehicle = {
        vehicleId: 'vehicle-id',
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        dealershipId: 'dealership-id',
        sales: [],
        dealership: {},
      };

      (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue(vehicle);

      const result = await service.getVehicleById(
        vehicle.vehicleId,
        vehicle.dealershipId,
      );

      expect(result).toEqual(vehicle);
      expect(prisma.vehicle.findUnique).toHaveBeenCalledWith({
        where: {
          vehicleId: vehicle.vehicleId,
          dealershipId: vehicle.dealershipId,
        },
        include: { sales: true, dealership: true },
      });
    });
  });

  describe('getVehiclesByCriteria', () => {
    it('should return vehicles by a combination of make, model, and year', async () => {
      const vehicles = [
        {
          vehicleId: 'vehicle-id-1',
          make: 'Toyota',
          model: 'Camry',
          year: 2020,
          dealershipId: 'dealership-id',
          sales: [],
          dealership: {},
        },
      ];

      (prisma.vehicle.findMany as jest.Mock).mockResolvedValue(vehicles);

      const result = await service.getVehiclesByCriteria(
        'dealership-id',
        'Toyota',
        'Camry',
        2020,
      );

      expect(result).toEqual([vehicles[0]]);
      expect(prisma.vehicle.findMany).toHaveBeenCalledWith({
        where: {
          make: { contains: 'Toyota' },
          model: { contains: 'Camry' },
          year: 2020,
          dealershipId: 'dealership-id',
        },
        include: { sales: true, dealership: true },
      });
    });

    it('should return vehicles by dealership ID only', async () => {
      const vehicles = [
        {
          vehicleId: 'vehicle-id-1',
          make: 'Toyota',
          model: 'Camry',
          year: 2020,
          dealershipId: 'dealership-id',
          sales: [],
          dealership: {},
        },
        {
          vehicleId: 'vehicle-id-2',
          make: 'Toyota',
          model: 'Corolla',
          year: 2019,
          dealershipId: 'dealership-id',
          sales: [],
          dealership: {},
        },
      ];

      (prisma.vehicle.findMany as jest.Mock).mockResolvedValue(vehicles);

      const result = await service.getVehiclesByCriteria('dealership-id');

      expect(result).toEqual(vehicles);
      expect(prisma.vehicle.findMany).toHaveBeenCalledWith({
        where: { dealershipId: 'dealership-id' },
        include: { sales: true, dealership: true },
      });
    });
  });

  describe('updateVehicle', () => {
    it('should update an existing vehicle and return it', async () => {
      const vehicleData = {
        vehicleId: 'vehicle-id',
        make: 'Toyota',
        model: 'Camry',
        year: 2021,
        dealershipId: 'dealership-id',
      };
      const updatedVehicle = { ...vehicleData };

      (prisma.vehicle.update as jest.Mock).mockResolvedValue(updatedVehicle);

      const result = await service.updateVehicle(
        vehicleData.vehicleId,
        vehicleData.make,
        vehicleData.model,
        vehicleData.year,
        vehicleData.dealershipId,
      );

      expect(result).toEqual(updatedVehicle);
      expect(prisma.vehicle.update).toHaveBeenCalledWith({
        where: { vehicleId: vehicleData.vehicleId },
        data: {
          make: vehicleData.make,
          model: vehicleData.model,
          year: vehicleData.year,
          dealershipId: vehicleData.dealershipId,
        },
      });
    });
  });

  describe('deleteVehicle', () => {
    it('should delete a vehicle by its ID and return it', async () => {
      const vehicle = {
        vehicleId: 'vehicle-id',
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        dealershipId: 'dealership-id',
      };

      (prisma.vehicle.delete as jest.Mock).mockResolvedValue(vehicle);

      const result = await service.deleteVehicle(
        vehicle.vehicleId,
        vehicle.dealershipId,
      );

      expect(result).toEqual(vehicle);
      expect(prisma.vehicle.delete).toHaveBeenCalledWith({
        where: {
          vehicleId: vehicle.vehicleId,
          dealershipId: vehicle.dealershipId,
        },
      });
    });
  });
});
