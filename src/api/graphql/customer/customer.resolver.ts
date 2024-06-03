import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Customer } from '../../../service/entities/customer.entity';
import { CustomerService } from '../../../service/customer/customer.service';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ClsService } from 'nestjs-cls';
import { DealershipService } from '../../../service/dealership/dealership.service';

@Resolver(() => Customer)
@UseGuards(JwtAuthGuard)
export class CustomerResolver {
  constructor(
    private readonly customerService: CustomerService,
    private readonly dealershipService: DealershipService,
    private readonly clsService: ClsService,
  ) {}

  /**
   * Retrieves a customer by their ID.
   * @param customerId - The ID of the customer to retrieve.
   * @param dealershipId - Optional ID of the dealership to validate access.
   * @returns The customer matching the ID.
   */
  @Query(() => Customer, {
    nullable: true,
    description: 'Retrieves a customer by their ID.',
  })
  async customer(
    @Args('id', { type: () => ID }) customerId: string,
    @Args('dealershipId', { type: () => ID, nullable: true })
    dealershipId?: string,
  ): Promise<Customer | null> {
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
    return this.customerService.getCustomerById(customerId, dealershipId);
  }

  /**
   * Retrieves customers by their last name.
   * @param lastName - The last name of the customers to retrieve.
   * @param dealershipId - Optional ID of the dealership to validate access.
   * @returns A list of customers matching the last name.
   */
  @Query(() => [Customer], {
    description: 'Retrieves customers by their last name.',
  })
  async customersByLastName(
    @Args('lastName') lastName: string,
    @Args('dealershipId', { type: () => ID, nullable: true })
    dealershipId?: string,
  ): Promise<Customer[]> {
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
    return this.customerService.getCustomersByLastName(lastName, dealershipId);
  }

  /**
   * Creates a new customer.
   * @param firstName - The first name of the customer.
   * @param lastName - The last name of the customer.
   * @param email - The email address of the customer.
   * @param phone - The phone number of the customer.
   * @param dealershipId - Optional ID of the dealership to validate access.
   * @returns The created customer.
   */
  @Mutation(() => Customer, { description: 'Creates a new customer.' })
  async createCustomer(
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
    @Args('email') email: string,
    @Args('phone') phone: string,
    @Args('dealershipId', { type: () => ID, nullable: true })
    dealershipId?: string,
  ): Promise<Customer> {
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
    return this.customerService.createCustomer(
      firstName,
      lastName,
      email,
      phone,
      dealershipId,
    );
  }

  /**
   * Updates an existing customer.
   * @param customerId - The ID of the customer to update.
   * @param firstName - The updated first name of the customer.
   * @param lastName - The updated last name of the customer.
   * @param email - The updated email address of the customer.
   * @param phone - The updated phone number of the customer.
   * @param dealershipId - Optional ID of the dealership to validate access.
   * @returns The updated customer.
   */
  @Mutation(() => Customer, { description: 'Updates an existing customer.' })
  async updateCustomer(
    @Args('customerId', { type: () => ID }) customerId: string,
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
    @Args('email') email: string,
    @Args('phone') phone: string,
    @Args('dealershipId', { type: () => ID, nullable: true })
    dealershipId?: string,
  ): Promise<Customer> {
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
    return this.customerService.updateCustomer(
      customerId,
      firstName,
      lastName,
      email,
      phone,
      dealershipId,
    );
  }

  /**
   * Deletes a customer by their ID.
   * @param customerId - The ID of the customer to delete.
   * @param dealershipId - Optional ID of the dealership to validate access.
   * @returns The deleted customer.
   */
  @Mutation(() => Customer, { description: 'Deletes a customer by their ID.' })
  async deleteCustomer(
    @Args('customerId', { type: () => ID }) customerId: string,
    @Args('dealershipId', { type: () => ID, nullable: true })
    dealershipId?: string,
  ): Promise<Customer> {
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
    return this.customerService.deleteCustomer(customerId, dealershipId);
  }
}
