import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Sale } from '../../../service/entities/sale.entity';
import { SaleService } from '../../../service/sale/sale.service';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ClsService } from 'nestjs-cls';
import { DealershipService } from '../../../service/dealership/dealership.service';

@Resolver(() => Sale)
@UseGuards(JwtAuthGuard)
export class SaleResolver {
  constructor(
    private readonly saleService: SaleService,
    private readonly dealershipService: DealershipService,
    private readonly clsService: ClsService,
  ) {}

  /**
   * Retrieves a sale by its ID.
   * @param saleId - The ID of the sale to retrieve.
   * @param dealershipId - Optional ID of the dealership to validate access.
   * @returns The sale matching the ID.
   */
  @Query(() => Sale, {
    nullable: true,
    description: 'Retrieves a sale by its ID.',
  })
  async sale(
    @Args('id', { type: () => ID }) saleId: string,
    @Args('dealershipId', { type: () => ID, nullable: true })
    dealershipId?: string,
  ): Promise<Sale | null> {
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
    return this.saleService.getSaleById(saleId, dealershipId);
  }

  /**
   * Retrieves all sales for a specific dealership.
   * @param dealershipId - The ID of the dealership to retrieve sales for.
   * @returns A list of sales for the specified dealership.
   */
  @Query(() => [Sale], {
    description: 'Retrieves all sales for a specific dealership.',
  })
  async salesByDealership(
    @Args('dealershipId', { type: () => ID }) dealershipId: string,
  ): Promise<Sale[]> {
    const userDealershipId = this.clsService.get('dealershipId');
    const hasAccess = await this.dealershipService.validateDealershipAccess(
      userDealershipId,
      dealershipId,
    );
    if (!hasAccess) {
      throw new UnauthorizedException();
    }
    return this.saleService.getSalesByDealershipId(dealershipId);
  }

  /**
   * Creates a new sale transaction.
   * @param date - The date of the sale.
   * @param vehicleId - The ID of the vehicle being sold.
   * @param purchaseNetAmount - The net amount of the purchase.
   * @param customerId - The ID of the customer buying the vehicle.
   * @param dealershipId - Optional ID of the dealership to validate access.
   * @returns The created sale transaction.
   */
  @Mutation(() => Sale, { description: 'Creates a new sale transaction.' })
  async createSale(
    @Args('date') date: Date,
    @Args('vehicleId', { type: () => ID }) vehicleId: string,
    @Args('purchaseNetAmount', { type: () => Number })
    purchaseNetAmount: number,
    @Args('customerId', { type: () => ID }) customerId: string,
    @Args('dealershipId', { type: () => ID, nullable: true })
    dealershipId?: string,
  ): Promise<Sale> {
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
    return this.saleService.createSale(
      date,
      purchaseNetAmount,
      vehicleId,
      customerId,
      dealershipId,
    );
  }

  /**
   * Updates an existing sale transaction.
   * @param saleId - The ID of the sale to update.
   * @param date - The updated date of the sale.
   * @param purchaseNetAmount - The updated net amount of the purchase.
   * @param vehicleId - The updated ID of the vehicle.
   * @param customerId - The updated ID of the customer.
   * @param dealershipId - Optional ID of the dealership to validate access.
   * @returns The updated sale transaction.
   */
  @Mutation(() => Sale, {
    description: 'Updates an existing sale transaction.',
  })
  async updateSale(
    @Args('saleId', { type: () => ID }) saleId: string,
    @Args('date') date: Date,
    @Args('purchaseNetAmount', { type: () => Number })
    purchaseNetAmount: number,
    @Args('vehicleId', { type: () => ID }) vehicleId: string,
    @Args('customerId', { type: () => ID }) customerId: string,
    @Args('dealershipId', { type: () => ID, nullable: true })
    dealershipId?: string,
  ): Promise<Sale> {
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
    return this.saleService.updateSale(
      saleId,
      date,
      purchaseNetAmount,
      vehicleId,
      customerId,
      dealershipId,
    );
  }

  /**
   * Deletes a sale transaction by its ID.
   * @param saleId - The ID of the sale transaction to delete.
   * @param dealershipId - Optional ID of the dealership to validate access.
   * @returns The deleted sale transaction.
   */
  @Mutation(() => Sale, {
    description: 'Deletes a sale transaction by its ID.',
  })
  async deleteSale(
    @Args('saleId', { type: () => ID }) saleId: string,
    @Args('dealershipId', { type: () => ID, nullable: true })
    dealershipId?: string,
  ): Promise<Sale> {
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
    return this.saleService.deleteSale(saleId, dealershipId);
  }
}
