import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { SaleService } from './sale.service';

const mockPrismaService = {
  sale: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('SaleService', () => {
  let service: SaleService;
  let prisma: PrismaService;

  beforeEach(async () => {
    jest.restoreAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaleService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SaleService>(SaleService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSale', () => {
    it('should create a new sale and return it', async () => {
      const saleData = {
        date: new Date(),
        purchaseNetAmount: 10000,
        vehicleId: 'vehicle-id',
        customerId: 'customer-id',
        dealershipId: 'dealership-id',
      };
      const createdSale = { ...saleData, saleId: 'sale-id' };

      (prisma.sale.create as jest.Mock).mockResolvedValue(createdSale);
      (prisma.sale.findFirst as jest.Mock).mockResolvedValue(createdSale);

      const result = await service.createSale(
        saleData.date,
        saleData.purchaseNetAmount,
        saleData.vehicleId,
        saleData.customerId,
        saleData.dealershipId,
      );

      expect(result).toEqual(createdSale);
      expect(prisma.sale.create).toHaveBeenCalledWith({
        data: saleData,
      });
      expect(prisma.sale.findFirst).toHaveBeenCalledWith({
        where: {
          saleId: createdSale.saleId,
          dealershipId: saleData.dealershipId,
        },
        include: { vehicle: true, customer: true, dealership: true },
      });
    });
  });

  describe('getSaleById', () => {
    it('should return a sale by its ID and dealership ID', async () => {
      const sale = {
        saleId: 'sale-id',
        date: new Date(),
        purchaseNetAmount: 10000,
        vehicleId: 'vehicle-id',
        customerId: 'customer-id',
        dealershipId: 'dealership-id',
        vehicle: {},
        customer: {},
        dealership: {},
      };

      (prisma.sale.findFirst as jest.Mock).mockResolvedValue(sale);

      const result = await service.getSaleById(sale.saleId, sale.dealershipId);

      expect(result).toEqual(sale);
      expect(prisma.sale.findFirst).toHaveBeenCalledWith({
        where: {
          saleId: sale.saleId,
          dealershipId: sale.dealershipId,
        },
        include: { vehicle: true, customer: true, dealership: true },
      });
    });
  });

  describe('getSalesByDealershipId', () => {
    it('should return all sales for a specific dealership', async () => {
      const sales = [
        {
          saleId: 'sale-id-1',
          date: new Date(),
          purchaseNetAmount: 10000,
          vehicleId: 'vehicle-id-1',
          customerId: 'customer-id-1',
          dealershipId: 'dealership-id',
          vehicle: {},
          customer: {},
          dealership: {},
        },
        {
          saleId: 'sale-id-2',
          date: new Date(),
          purchaseNetAmount: 15000,
          vehicleId: 'vehicle-id-2',
          customerId: 'customer-id-2',
          dealershipId: 'dealership-id',
          vehicle: {},
          customer: {},
          dealership: {},
        },
      ];

      (prisma.sale.findMany as jest.Mock).mockResolvedValue(sales);

      const result = await service.getSalesByDealershipId('dealership-id');

      expect(result).toEqual(sales);
      expect(prisma.sale.findMany).toHaveBeenCalledWith({
        where: { dealershipId: 'dealership-id' },
        include: { vehicle: true, customer: true, dealership: true },
      });
    });
  });

  describe('updateSale', () => {
    it('should update an existing sale and return it', async () => {
      const saleData = {
        saleId: 'sale-id',
        date: new Date(),
        purchaseNetAmount: 12000,
        vehicleId: 'vehicle-id',
        customerId: 'customer-id',
        dealershipId: 'dealership-id',
      };
      const updatedSale = { ...saleData };

      (prisma.sale.update as jest.Mock).mockResolvedValue(updatedSale);

      const result = await service.updateSale(
        saleData.saleId,
        saleData.date,
        saleData.purchaseNetAmount,
        saleData.vehicleId,
        saleData.customerId,
        saleData.dealershipId,
      );

      expect(result).toEqual(updatedSale);
      expect(prisma.sale.update).toHaveBeenCalledWith({
        where: { saleId: saleData.saleId, dealershipId: saleData.dealershipId },
        data: {
          date: saleData.date,
          vehicleId: saleData.vehicleId,
          customerId: saleData.customerId,
          dealershipId: saleData.dealershipId,
          purchaseNetAmount: saleData.purchaseNetAmount,
        },
      });
    });
  });

  describe('deleteSale', () => {
    it('should delete a sale by its ID and dealership ID and return it', async () => {
      const sale = {
        saleId: 'sale-id',
        date: new Date(),
        purchaseNetAmount: 10000,
        vehicleId: 'vehicle-id',
        customerId: 'customer-id',
        dealershipId: 'dealership-id',
      };

      (prisma.sale.delete as jest.Mock).mockResolvedValue(sale);

      const result = await service.deleteSale(sale.saleId, sale.dealershipId);

      expect(result).toEqual(sale);
      expect(prisma.sale.delete).toHaveBeenCalledWith({
        where: { saleId: sale.saleId, dealershipId: sale.dealershipId },
      });
    });
  });
});
