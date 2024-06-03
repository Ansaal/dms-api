import { Test, TestingModule } from '@nestjs/testing';
import { CustomerResolver } from './customer.resolver';
import { CustomerService } from '../../../service/customer/customer.service';
import { DealershipService } from '../../../service/dealership/dealership.service';
import { ClsModule, ClsService } from 'nestjs-cls';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UnauthorizedException } from '@nestjs/common';
import { Customer } from '../../../service/entities/customer.entity';
import { ServiceModule } from '../../../service/service.module';
import { PrismaModule } from '../../../prisma/prisma.module';
import { Dealership } from '../../../service/entities/dealership.entity';

describe('CustomerResolver', () => {
  let resolver: CustomerResolver;
  let customerService: CustomerService;
  let dealershipService: DealershipService;
  let clsService: ClsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ServiceModule, ClsModule.forRoot(), PrismaModule],
      providers: [CustomerResolver, JwtAuthGuard],
    }).compile();

    resolver = module.get<CustomerResolver>(CustomerResolver);
    customerService = module.get<CustomerService>(CustomerService);
    dealershipService = module.get<DealershipService>(DealershipService);
    clsService = module.get<ClsService>(ClsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('customer', () => {
    it('should return a customer by ID', async () => {
      const customer = new Customer();
      customer.customerId = 'customer-id';
      customer.dealership = { dealershipId: 'dealership-id' } as Dealership;

      jest
        .spyOn(customerService, 'getCustomerById')
        .mockResolvedValue(customer);
      jest.spyOn(clsService, 'get').mockReturnValue('dealership-id');
      jest
        .spyOn(dealershipService, 'validateDealershipAccess')
        .mockResolvedValue(true);

      const result = await resolver.customer('customer-id', 'dealership-id');

      expect(result).toEqual(customer);
      expect(customerService.getCustomerById).toHaveBeenCalledWith(
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
        resolver.customer('customer-id', 'dealership-id'),
      ).rejects.toThrow(UnauthorizedException);
      expect(dealershipService.validateDealershipAccess).toHaveBeenCalledWith(
        'dealership-id',
        'dealership-id',
      );
    });
  });

  describe('customersByLastName', () => {
    it('should return customers by last name', async () => {
      const customers = [new Customer(), new Customer()];
      jest
        .spyOn(customerService, 'getCustomersByLastName')
        .mockResolvedValue(customers);
      jest.spyOn(clsService, 'get').mockReturnValue('dealership-id');
      jest
        .spyOn(dealershipService, 'validateDealershipAccess')
        .mockResolvedValue(true);

      const result = await resolver.customersByLastName('Doe', 'dealership-id');

      expect(result).toEqual(customers);
      expect(customerService.getCustomersByLastName).toHaveBeenCalledWith(
        'Doe',
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
        resolver.customersByLastName('Doe', 'dealership-id'),
      ).rejects.toThrow(UnauthorizedException);
      expect(dealershipService.validateDealershipAccess).toHaveBeenCalledWith(
        'dealership-id',
        'dealership-id',
      );
    });
  });

  describe('createCustomer', () => {
    it('should create a new customer', async () => {
      const customer = new Customer();
      jest.spyOn(customerService, 'createCustomer').mockResolvedValue(customer);
      jest.spyOn(clsService, 'get').mockReturnValue('dealership-id');
      jest
        .spyOn(dealershipService, 'validateDealershipAccess')
        .mockResolvedValue(true);

      const result = await resolver.createCustomer(
        'John',
        'Doe',
        'john.doe@example.com',
        '1234567890',
        'dealership-id',
      );

      expect(result).toEqual(customer);
      expect(customerService.createCustomer).toHaveBeenCalledWith(
        'John',
        'Doe',
        'john.doe@example.com',
        '1234567890',
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
        resolver.createCustomer(
          'John',
          'Doe',
          'john.doe@example.com',
          '1234567890',
          'dealership-id',
        ),
      ).rejects.toThrow(UnauthorizedException);
      expect(dealershipService.validateDealershipAccess).toHaveBeenCalledWith(
        'dealership-id',
        'dealership-id',
      );
    });
  });

  describe('updateCustomer', () => {
    it('should update a customer', async () => {
      const customer = new Customer();
      jest.spyOn(customerService, 'updateCustomer').mockResolvedValue(customer);
      jest.spyOn(clsService, 'get').mockReturnValue('dealership-id');
      jest
        .spyOn(dealershipService, 'validateDealershipAccess')
        .mockResolvedValue(true);

      const result = await resolver.updateCustomer(
        'customer-id',
        'John',
        'Doe',
        'john.doe@example.com',
        '1234567890',
        'dealership-id',
      );

      expect(result).toEqual(customer);
      expect(customerService.updateCustomer).toHaveBeenCalledWith(
        'customer-id',
        'John',
        'Doe',
        'john.doe@example.com',
        '1234567890',
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
        resolver.updateCustomer(
          'customer-id',
          'John',
          'Doe',
          'john.doe@example.com',
          '1234567890',
          'dealership-id',
        ),
      ).rejects.toThrow(UnauthorizedException);
      expect(dealershipService.validateDealershipAccess).toHaveBeenCalledWith(
        'dealership-id',
        'dealership-id',
      );
    });
  });

  describe('deleteCustomer', () => {
    it('should delete a customer', async () => {
      const customer = new Customer();
      jest.spyOn(customerService, 'deleteCustomer').mockResolvedValue(customer);
      jest.spyOn(clsService, 'get').mockReturnValue('dealership-id');
      jest
        .spyOn(dealershipService, 'validateDealershipAccess')
        .mockResolvedValue(true);

      const result = await resolver.deleteCustomer(
        'customer-id',
        'dealership-id',
      );

      expect(result).toEqual(customer);
      expect(customerService.deleteCustomer).toHaveBeenCalledWith(
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
        resolver.deleteCustomer('customer-id', 'dealership-id'),
      ).rejects.toThrow(UnauthorizedException);
      expect(dealershipService.validateDealershipAccess).toHaveBeenCalledWith(
        'dealership-id',
        'dealership-id',
      );
    });
  });
});
