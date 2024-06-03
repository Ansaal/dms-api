import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { DealershipService } from './dealership.service';

const mockPrismaService = {
  dealership: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  $queryRaw: jest.fn(),
};

describe('DealershipService', () => {
  let service: DealershipService;
  let prisma: PrismaService;

  beforeEach(async () => {
    jest.restoreAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DealershipService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<DealershipService>(DealershipService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDealerships', () => {
    it('should return a list of ancestor dealerships', async () => {
      const parentDealershipId = 'parent-id';
      const ancestorDealerships = [
        { dealershipId: 'id1', name: 'Dealer1', parentDealershipId: null },
        { dealershipId: 'id2', name: 'Dealer2', parentDealershipId: 'id1' },
      ];

      (prisma.$queryRaw as jest.Mock).mockResolvedValue(ancestorDealerships);
      (prisma.dealership.findMany as jest.Mock).mockResolvedValue(
        ancestorDealerships,
      );

      const result = await service.getDealerships(parentDealershipId);

      expect(result).toEqual(ancestorDealerships);
      expect(prisma.$queryRaw).toHaveBeenCalledWith(
        expect.anything(),
        'parent-id',
      );
      expect(prisma.dealership.findMany).toHaveBeenCalledWith({
        where: {
          dealershipId: {
            in: ancestorDealerships.map((d) => d.dealershipId),
          },
        },
        include: {
          subDealerships: true,
          vehicles: false,
          sales: false,
          customers: false,
        },
      });
    });
  });

  describe('getDealershipById', () => {
    it('should return a dealership by its ID', async () => {
      const dealership = {
        dealershipId: 'dealership-id',
        name: 'Dealer',
        parentDealershipId: null,
        subDealerships: [],
        vehicles: [],
        sales: [],
        customers: [],
      };

      (prisma.dealership.findUnique as jest.Mock).mockResolvedValue(dealership);

      const result = await service.getDealershipById(dealership.dealershipId);

      expect(result).toEqual(dealership);
      expect(prisma.dealership.findUnique).toHaveBeenCalledWith({
        where: { dealershipId: dealership.dealershipId },
        include: {
          subDealerships: true,
          vehicles: true,
          sales: true,
          customers: true,
        },
      });
    });
  });

  describe('createDealership', () => {
    it('should create a new dealership', async () => {
      const dealershipData = {
        name: 'New Dealer',
        address: '123 Main St',
        parentDealershipId: 'parent-id',
      };
      const createdDealership = {
        ...dealershipData,
        dealershipId: 'new-id',
      };

      (prisma.dealership.create as jest.Mock).mockResolvedValue(
        createdDealership,
      );

      const result = await service.createDealership(
        dealershipData.name,
        dealershipData.address,
        dealershipData.parentDealershipId,
      );

      expect(result).toEqual(createdDealership);
      expect(prisma.dealership.create).toHaveBeenCalledWith({
        data: dealershipData,
      });
    });
  });

  describe('updateDealership', () => {
    it('should update an existing dealership', async () => {
      const dealershipData = {
        dealershipId: 'dealership-id',
        name: 'Updated Dealer',
        address: '456 Main St',
        parentDealershipId: 'parent-id',
      };
      const updatedDealership = { ...dealershipData };

      (prisma.dealership.update as jest.Mock).mockResolvedValue(
        updatedDealership,
      );

      const result = await service.updateDealership(
        dealershipData.dealershipId,
        dealershipData.name,
        dealershipData.address,
        dealershipData.parentDealershipId,
      );

      expect(result).toEqual(updatedDealership);
      expect(prisma.dealership.update).toHaveBeenCalledWith({
        where: { dealershipId: dealershipData.dealershipId },
        data: {
          name: dealershipData.name,
          address: dealershipData.address,
          parentDealershipId: dealershipData.parentDealershipId,
        },
      });
    });
  });

  describe('isAncestor', () => {
    it('should return true if a dealership is an ancestor of another dealership', async () => {
      const parentDealershipId = 'parent-id';
      const childDealershipId = 'child-id';
      const childDealership = { parentDealershipId };

      (prisma.dealership.findUnique as jest.Mock).mockResolvedValue(
        childDealership,
      );

      const result = await service.isAncestor(
        parentDealershipId,
        childDealershipId,
      );

      expect(result).toBe(true);
      expect(prisma.dealership.findUnique).toHaveBeenCalledWith({
        where: { dealershipId: childDealershipId },
        select: { parentDealershipId: true },
      });
    });

    it('should return false if a dealership is not an ancestor of another dealership', async () => {
      const parentDealershipId = 'parent-id';
      const childDealershipId = 'child-id';
      const childDealership = { parentDealershipId: 'other-parent-id' };

      (prisma.dealership.findUnique as jest.Mock).mockResolvedValue(null);

      (prisma.dealership.findUnique as jest.Mock).mockResolvedValueOnce(
        childDealership,
      );

      const result = await service.isAncestor(
        parentDealershipId,
        childDealershipId,
      );

      expect(result).toBe(false);
      expect(prisma.dealership.findUnique).toHaveBeenCalledWith({
        where: { dealershipId: childDealershipId },
        select: { parentDealershipId: true },
      });
    });
  });

  describe('validateDealershipAccess', () => {
    it('should return true if user has access to the target dealership', async () => {
      const userDealershipId = 'user-id';
      const targetDealershipId = 'target-id';
      const subDealerships = [{ dealershipId: targetDealershipId }];

      (prisma.$queryRaw as jest.Mock).mockResolvedValueOnce(subDealerships);

      const result = await service.validateDealershipAccess(
        userDealershipId,
        targetDealershipId,
      );

      expect(result).toBe(true);
      expect(prisma.$queryRaw).toHaveBeenCalledWith(
        expect.anything(),
        'user-id',
        'target-id',
      );
    });

    it('should return false if user does not have access to the target dealership', async () => {
      const userDealershipId = 'user-id';
      const targetDealershipId = 'target-id';
      const subDealerships = [];

      (prisma.$queryRaw as jest.Mock).mockResolvedValue(subDealerships);

      const result = await service.validateDealershipAccess(
        userDealershipId,
        targetDealershipId,
      );

      expect(result).toBe(false);
      expect(prisma.$queryRaw).toHaveBeenCalledWith(
        expect.anything(),
        'user-id',
        'target-id',
      );
    });
  });
});
