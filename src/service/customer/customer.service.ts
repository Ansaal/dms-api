import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new customer in the specified dealership.
   * @param firstName - The first name of the customer.
   * @param lastName - The last name of the customer.
   * @param email - The email address of the customer.
   * @param phone - The phone number of the customer.
   * @param dealershipId - The dealership ID where the customer belongs.
   * @returns Promise<Customer> - The created customer.
   */
  async createCustomer(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    dealershipId: string,
  ): Promise<Customer> {
    this.logger.log(
      `Creating customer: ${firstName} ${lastName} in dealership ID: ${dealershipId}`,
    );
    const customer = await this.prisma.customer.create({
      data: { firstName, lastName, email, phone, dealershipId },
    });
    return this.getCustomerById(customer.customerId, dealershipId);
  }

  /**
   * Retrieves a customer by their ID within the specified dealership.
   * @param customerId - The ID of the customer.
   * @param dealershipId - The dealership ID where the customer belongs.
   * @returns Promise<Customer | null> - The customer or null if not found.
   */
  async getCustomerById(
    customerId: string,
    dealershipId: string,
  ): Promise<Customer | null> {
    this.logger.log(
      `Fetching customer ID: ${customerId} from dealership ID: ${dealershipId}`,
    );
    const customer = await this.prisma.customer.findFirst({
      where: {
        customerId,
        dealershipId,
      },
      include: { sales: true, dealership: true },
    });

    return customer as unknown as Customer | null;
  }

  /**
   * Retrieves customers by their last name within the specified dealership.
   * @param lastName - The last name of the customers to search for.
   * @param dealershipId - The dealership ID where the customers belong.
   * @returns Promise<Customer[]> - A list of customers matching the last name.
   */
  async getCustomersByLastName(
    lastName: string,
    dealershipId: string,
  ): Promise<Customer[]> {
    this.logger.log(
      `Fetching customers with last name: ${lastName} from dealership ID: ${dealershipId}`,
    );
    return this.prisma.customer.findMany({
      where: {
        lastName: {
          contains: lastName,
        },
        dealershipId,
      },
      include: { sales: true, dealership: true },
    }) as unknown as Customer[];
  }

  /**
   * Updates an existing customer's information within the specified dealership.
   * @param customerId - The ID of the customer to update.
   * @param firstName - The updated first name of the customer.
   * @param lastName - The updated last name of the customer.
   * @param email - The updated email address of the customer.
   * @param phone - The updated phone number of the customer.
   * @param dealershipId - The dealership ID where the customer belongs.
   * @returns Promise<Customer> - The updated customer.
   */
  async updateCustomer(
    customerId: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    dealershipId: string,
  ): Promise<Customer> {
    this.logger.log(
      `Updating customer ID: ${customerId} in dealership ID: ${dealershipId}`,
    );
    const customer = await this.prisma.customer.update({
      where: {
        customerId,
        dealershipId,
      },
      data: { firstName, lastName, email, phone },
    });

    return customer as unknown as Customer;
  }

  /**
   * Deletes a customer by their ID within the specified dealership.
   * @param customerId - The ID of the customer to delete.
   * @param dealershipId - The dealership ID where the customer belongs.
   * @returns Promise<Customer> - The deleted customer.
   */
  async deleteCustomer(
    customerId: string,
    dealershipId: string,
  ): Promise<Customer> {
    this.logger.log(
      `Deleting customer ID: ${customerId} from dealership ID: ${dealershipId}`,
    );
    const customer = await this.prisma.customer.delete({
      where: {
        customerId,
        dealershipId,
      },
    });

    return customer as unknown as Customer;
  }
}
