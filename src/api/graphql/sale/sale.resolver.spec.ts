import { Test, TestingModule } from '@nestjs/testing';
import { SaleResolver } from './sale.resolver';
import { SaleService } from '../../../service/sale/sale.service';
import { DealershipService } from '../../../service/dealership/dealership.service';
import { ClsModule, ClsService } from 'nestjs-cls';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UnauthorizedException } from '@nestjs/common';
import { Sale } from '../../../service/entities/sale.entity';
import { ServiceModule } from '../../../service/service.module';
import { PrismaModule } from '../../../prisma/prisma.module';
import { Dealership } from '../../../service/entities/dealership.entity';

describe('SaleResolver', () => {
  let resolver: SaleResolver;
  let saleService: SaleService;
  let dealershipService: DealershipService;
  let clsService: ClsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ServiceModule, ClsModule.forRoot(), PrismaModule],
      providers: [SaleResolver, JwtAuthGuard],
    }).compile();

    resolver = module.get<SaleResolver>(SaleResolver);
    saleService = module.get<SaleService>(SaleService);
    dealershipService = module.get<DealershipService>(DealershipService);
    clsService = module.get<ClsService>(ClsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('sale', () => {
    it('should return a sale by ID', async () => {
      const sale = new Sale();
      sale.saleId = 'sale-id';
      sale.dealership = { dealershipId: 'dealership-id' } as Dealership;

      jest.spyOn(saleService, 'getSaleById').mockResolvedValue(sale);
      jest.spyOn(clsService, 'get').mockReturnValue('dealership-id');
      jest
        .spyOn(dealershipService, 'validateDealershipAccess')
        .mockResolvedValue(true);

      const result = await resolver.sale('sale-id', 'dealership-id');

      expect(result).toEqual(sale);
      expect(saleService.getSaleById).toHaveBeenCalledWith(
        'sale-id',
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

      await expect(resolver.sale('sale-id', 'dealership-id')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(dealershipService.validateDealershipAccess).toHaveBeenCalledWith(
        'dealership-id',
        'dealership-id',
      );
    });
  });

  describe('salesByDealership', () => {
    it('should return sales by dealership ID', async () => {
      const sales = [new Sale(), new Sale()];
      jest
        .spyOn(saleService, 'getSalesByDealershipId')
        .mockResolvedValue(sales);
      jest.spyOn(clsService, 'get').mockReturnValue('dealership-id');
      jest
        .spyOn(dealershipService, 'validateDealershipAccess')
        .mockResolvedValue(true);

      const result = await resolver.salesByDealership('dealership-id');

      expect(result).toEqual(sales);
      expect(saleService.getSalesByDealershipId).toHaveBeenCalledWith(
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

      await expect(resolver.salesByDealership('dealership-id')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(dealershipService.validateDealershipAccess).toHaveBeenCalledWith(
        'dealership-id',
        'dealership-id',
      );
    });
  });

  describe('createSale', () => {
    it('should create a new sale', async () => {
      const sale = new Sale();
      jest.spyOn(saleService, 'createSale').mockResolvedValue(sale);
      jest.spyOn(clsService, 'get').mockReturnValue('dealership-id');
      jest
        .spyOn(dealershipService, 'validateDealershipAccess')
        .mockResolvedValue(true);

      const result = await resolver.createSale(
        new Date(),
        'vehicle-id',
        10000,
        'customer-id',
        'dealership-id',
      );

      expect(result).toEqual(sale);
      expect(saleService.createSale).toHaveBeenCalledWith(
        expect.any(Date),
        10000,
        'vehicle-id',
        'customer-id',
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
        resolver.createSale(
          new Date(),
          'vehicle-id',
          10000,
          'customer-id',
          'dealership-id',
        ),
      ).rejects.toThrow(UnauthorizedException);
      expect(dealershipService.validateDealershipAccess).toHaveBeenCalledWith(
        'dealership-id',
        'dealership-id',
      );
    });
  });

  describe('updateSale', () => {
    it('should update a sale', async () => {
      const sale = new Sale();
      jest.spyOn(saleService, 'updateSale').mockResolvedValue(sale);
      jest.spyOn(clsService, 'get').mockReturnValue('dealership-id');
      jest
        .spyOn(dealershipService, 'validateDealershipAccess')
        .mockResolvedValue(true);

      const result = await resolver.updateSale(
        'sale-id',
        new Date(),
        10000,
        'vehicle-id',
        'customer-id',
        'dealership-id',
      );

      expect(result).toEqual(sale);
      expect(saleService.updateSale).toHaveBeenCalledWith(
        'sale-id',
        expect.any(Date),
        10000,
        'vehicle-id',
        'customer-id',
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
        resolver.updateSale(
          'sale-id',
          new Date(),
          10000,
          'vehicle-id',
          'customer-id',
          'dealership-id',
        ),
      ).rejects.toThrow(UnauthorizedException);
      expect(dealershipService.validateDealershipAccess).toHaveBeenCalledWith(
        'dealership-id',
        'dealership-id',
      );
    });
  });

  describe('deleteSale', () => {
    it('should delete a sale', async () => {
      const sale = new Sale();
      jest.spyOn(saleService, 'deleteSale').mockResolvedValue(sale);
      jest.spyOn(clsService, 'get').mockReturnValue('dealership-id');
      jest
        .spyOn(dealershipService, 'validateDealershipAccess')
        .mockResolvedValue(true);

      const result = await resolver.deleteSale('sale-id', 'dealership-id');

      expect(result).toEqual(sale);
      expect(saleService.deleteSale).toHaveBeenCalledWith(
        'sale-id',
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
        resolver.deleteSale('sale-id', 'dealership-id'),
      ).rejects.toThrow(UnauthorizedException);
      expect(dealershipService.validateDealershipAccess).toHaveBeenCalledWith(
        'dealership-id',
        'dealership-id',
      );
    });
  });
});
