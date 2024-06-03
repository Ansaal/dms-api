import { Test, TestingModule } from '@nestjs/testing';
import { DealershipResolver } from './dealership.resolver';
import { DealershipService } from '../../../service/dealership/dealership.service';
import { ClsModule, ClsService } from 'nestjs-cls';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UnauthorizedException } from '@nestjs/common';
import { Dealership } from '../../../service/entities/dealership.entity';
import { ServiceModule } from '../../../service/service.module';
import { PrismaModule } from '../../../prisma/prisma.module';

describe('DealershipResolver', () => {
  let resolver: DealershipResolver;
  let dealershipService: DealershipService;
  let clsService: ClsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ServiceModule, ClsModule.forRoot(), PrismaModule],
      providers: [DealershipResolver, JwtAuthGuard],
    }).compile();

    resolver = module.get<DealershipResolver>(DealershipResolver);
    dealershipService = module.get<DealershipService>(DealershipService);
    clsService = module.get<ClsService>(ClsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('dealerships', () => {
    it('should return a list of dealerships', async () => {
      const dealerships = [new Dealership(), new Dealership()];
      jest
        .spyOn(dealershipService, 'getDealerships')
        .mockResolvedValue(dealerships);
      jest.spyOn(clsService, 'get').mockReturnValue('dealership-id');

      const result = await resolver.dealerships();

      expect(result).toEqual(dealerships);
      expect(dealershipService.getDealerships).toHaveBeenCalledWith(
        'dealership-id',
      );
    });
  });

  describe('dealership', () => {
    it('should return a dealership by ID', async () => {
      const dealership = new Dealership();
      dealership.dealershipId = 'dealership-id';

      jest
        .spyOn(dealershipService, 'getDealershipById')
        .mockResolvedValue(dealership);

      const result = await resolver.dealership('dealership-id');

      expect(result).toEqual(dealership);
      expect(dealershipService.getDealershipById).toHaveBeenCalledWith(
        'dealership-id',
      );
    });
  });

  describe('createDealership', () => {
    it('should create a new dealership', async () => {
      const dealership = new Dealership();
      jest
        .spyOn(dealershipService, 'createDealership')
        .mockResolvedValue(dealership);
      jest.spyOn(clsService, 'get').mockReturnValue('dealership-id');
      jest
        .spyOn(dealershipService, 'validateDealershipAccess')
        .mockResolvedValue(true);

      const result = await resolver.createDealership(
        'New Dealer',
        '123 Main St',
        'dealership-id',
      );

      expect(result).toEqual(dealership);
      expect(dealershipService.createDealership).toHaveBeenCalledWith(
        'New Dealer',
        '123 Main St',
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
        resolver.createDealership('New Dealer', '123 Main St', 'dealership-id'),
      ).rejects.toThrow(UnauthorizedException);
      expect(dealershipService.validateDealershipAccess).toHaveBeenCalledWith(
        'dealership-id',
        'dealership-id',
      );
    });
  });

  describe('updateDealership', () => {
    it('should update a dealership', async () => {
      const dealership = new Dealership();
      jest
        .spyOn(dealershipService, 'updateDealership')
        .mockResolvedValue(dealership);
      jest.spyOn(clsService, 'get').mockReturnValue('dealership-id');
      jest
        .spyOn(dealershipService, 'validateDealershipAccess')
        .mockResolvedValue(true);

      const result = await resolver.updateDealership(
        'dealership-id',
        'Updated Dealer',
        '456 Main St',
        'dealership-id',
      );

      expect(result).toEqual(dealership);
      expect(dealershipService.updateDealership).toHaveBeenCalledWith(
        'dealership-id',
        'Updated Dealer',
        '456 Main St',
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
        resolver.updateDealership(
          'dealership-id',
          'Updated Dealer',
          '456 Main St',
          'dealership-id',
        ),
      ).rejects.toThrow(UnauthorizedException);
      expect(dealershipService.validateDealershipAccess).toHaveBeenCalledWith(
        'dealership-id',
        'dealership-id',
      );
    });
  });
});
