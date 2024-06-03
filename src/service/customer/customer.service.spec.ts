import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { CustomerService } from './customer.service';

const mockPrismaService = {
  customer: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $queryRaw: jest.fn(),
};

describe('CustomerService', () => {
  let service: CustomerService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCustomer', () => {
    it('should create a customer and return it', async () => {
      const customerData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        dealershipId: 'dealership-id',
      };
      const createdCustomer = { ...customerData, customerId: 'customer-id' };
      (prisma.customer.create as jest.Mock).mockResolvedValue(createdCustomer);
      (prisma.customer.findFirst as jest.Mock).mockResolvedValue(
        createdCustomer,
      );

      const result = await service.createCustomer(
        customerData.firstName,
        customerData.lastName,
        customerData.email,
        customerData.phone,
        customerData.dealershipId,
      );

      expect(result).toEqual(createdCustomer);
      expect(prisma.customer.create).toHaveBeenCalledWith({
        data: customerData,
      });
      expect(prisma.customer.findFirst).toHaveBeenCalledWith({
        where: {
          customerId: createdCustomer.customerId,
          dealershipId: customerData.dealershipId,
        },
        include: { sales: true, dealership: true },
      });
    });
  });

  describe('getCustomerById', () => {
    it('should return a customer by ID', async () => {
      const customer = {
        customerId: 'customer-id',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        dealershipId: 'dealership-id',
        sales: [],
        dealership: {},
      };
      (prisma.customer.findFirst as jest.Mock).mockResolvedValue(customer);

      const result = await service.getCustomerById(
        customer.customerId,
        customer.dealershipId,
      );

      expect(result).toEqual(customer);
      expect(prisma.customer.findFirst).toHaveBeenCalledWith({
        where: {
          customerId: customer.customerId,
          dealershipId: customer.dealershipId,
        },
        include: { sales: true, dealership: true },
      });
    });
  });

  describe('getCustomersByLastName', () => {
    it('should return customers by last name', async () => {
      const customers = [
        {
          customerId: 'customer-id-1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '1234567890',
          dealershipId: 'dealership-id',
          sales: [],
          dealership: {},
        },
        {
          customerId: 'customer-id-2',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@example.com',
          phone: '0987654321',
          dealershipId: 'dealership-id',
          sales: [],
          dealership: {},
        },
      ];
      (prisma.customer.findMany as jest.Mock).mockResolvedValue(customers);

      const result = await service.getCustomersByLastName(
        'Doe',
        'dealership-id',
      );

      expect(result).toEqual(customers);
      expect(prisma.customer.findMany).toHaveBeenCalledWith({
        where: {
          lastName: {
            contains: 'Doe',
          },
          dealershipId: 'dealership-id',
        },
        include: { sales: true, dealership: true },
      });
    });
  });

  describe('updateCustomer', () => {
    it('should update a customer and return it', async () => {
      const customerData = {
        customerId: 'customer-id',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        dealershipId: 'dealership-id',
      };
      const updatedCustomer = { ...customerData, firstName: 'Johnny' };
      (prisma.customer.update as jest.Mock).mockResolvedValue(updatedCustomer);

      const result = await service.updateCustomer(
        customerData.customerId,
        updatedCustomer.firstName,
        customerData.lastName,
        customerData.email,
        customerData.phone,
        customerData.dealershipId,
      );

      expect(result).toEqual(updatedCustomer);
      expect(prisma.customer.update).toHaveBeenCalledWith({
        where: {
          customerId: customerData.customerId,
          dealershipId: customerData.dealershipId,
        },
        data: {
          firstName: updatedCustomer.firstName,
          lastName: customerData.lastName,
          email: customerData.email,
          phone: customerData.phone,
        },
      });
    });
  });

  describe('deleteCustomer', () => {
    it('should delete a customer and return it', async () => {
      const customer = {
        customerId: 'customer-id',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        dealershipId: 'dealership-id',
      };
      (prisma.customer.delete as jest.Mock).mockResolvedValue(customer);

      const result = await service.deleteCustomer(
        customer.customerId,
        customer.dealershipId,
      );

      expect(result).toEqual(customer);
      expect(prisma.customer.delete).toHaveBeenCalledWith({
        where: {
          customerId: customer.customerId,
          dealershipId: customer.dealershipId,
        },
      });
    });
  });
});
