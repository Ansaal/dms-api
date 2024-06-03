import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Dealership } from '../../../service/entities/dealership.entity';
import { DealershipService } from '../../../service/dealership/dealership.service';
import { UnauthorizedException, UseGuards, Logger } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ClsService } from 'nestjs-cls';

@Resolver(() => Dealership)
@UseGuards(JwtAuthGuard)
export class DealershipResolver {
  private readonly logger = new Logger(DealershipResolver.name);

  constructor(
    private readonly dealershipService: DealershipService,
    private readonly clsService: ClsService,
  ) {}

  /**
   * Fetches all dealerships for the authenticated dealership.
   *
   * @returns {Promise<Dealership[]>} List of dealerships.
   */
  @Query(() => [Dealership], {
    description: 'Fetches all dealerships for the authenticated dealership.',
  })
  dealerships(): Promise<Dealership[]> {
    const dealershipIdFromToken = this.clsService.get('dealershipId');
    this.logger.log(
      `Fetching dealerships for dealership ID: ${dealershipIdFromToken}`,
    );
    return this.dealershipService.getDealerships(dealershipIdFromToken);
  }

  /**
   * Fetches a single dealership by its ID.
   *
   * @param {string} dealershipId - The ID of the dealership to fetch.
   * @returns {Promise<Dealership | null>} The fetched dealership or null if not found.
   */
  @Query(() => Dealership, {
    nullable: true,
    description: 'Fetches a single dealership by its ID.',
  })
  async dealership(
    @Args('id', { type: () => Int }) dealershipId: string,
  ): Promise<Dealership | null> {
    this.logger.log(`Fetching dealership with ID: ${dealershipId}`);
    return this.dealershipService.getDealershipById(dealershipId);
  }

  /**
   * Creates a new dealership.
   *
   * @param {string} name - The name of the new dealership.
   * @param {string} address - The address of the new dealership.
   * @param {string} [parentDealershipId] - The optional ID of the parent dealership.
   * @returns {Promise<Dealership>} The created dealership.
   * @throws {UnauthorizedException} If the parent dealership ID is invalid.
   */
  @Mutation(() => Dealership, { description: 'Creates a new dealership.' })
  async createDealership(
    @Args('name') name: string,
    @Args('address') address: string,
    @Args('parentDealershipId', { type: () => ID, nullable: true })
    parentDealershipId?: string,
  ): Promise<Dealership> {
    const dealershipIdFromToken = this.clsService.get('dealershipId');
    this.logger.log(
      `Creating dealership with name: ${name}, parentDealershipId: ${parentDealershipId}`,
    );

    if (!parentDealershipId) {
      parentDealershipId = dealershipIdFromToken;
    } else {
      const parentDealershipIsAncestorOfUser =
        await this.dealershipService.validateDealershipAccess(
          dealershipIdFromToken,
          parentDealershipId,
        );
      if (!parentDealershipIsAncestorOfUser) {
        this.logger.warn(
          `Unauthorized attempt to create dealership under parent ID: ${parentDealershipId}`,
        );
        throw new UnauthorizedException();
      }
    }

    return this.dealershipService.createDealership(
      name,
      address,
      parentDealershipId,
    );
  }

  /**
   * Updates an existing dealership.
   *
   * @param {string} dealershipId - The ID of the dealership to update.
   * @param {string} name - The new name for the dealership.
   * @param {string} address - The new address for the dealership.
   * @param {string} [parentDealershipId] - The optional new parent dealership ID.
   * @returns {Promise<Dealership>} The updated dealership.
   * @throws {UnauthorizedException} If the dealership is not a sub-dealership or the same as the authenticated dealership.
   */
  @Mutation(() => Dealership, {
    description: 'Updates an existing dealership.',
  })
  async updateDealership(
    @Args('dealershipId', { type: () => ID }) dealershipId: string,
    @Args('name') name: string,
    @Args('address') address: string,
    @Args('parentDealershipId', { type: () => ID, nullable: true })
    parentDealershipId?: string,
  ): Promise<Dealership> {
    const dealershipIdFromToken = this.clsService.get('dealershipId');
    this.logger.log(
      `Updating dealership with ID: ${dealershipId}, new name: ${name}, parentDealershipId: ${parentDealershipId}`,
    );

    const selectedDealershipIsSubDealershipOrSame =
      await this.dealershipService.validateDealershipAccess(
        dealershipIdFromToken,
        dealershipId,
      );

    if (!selectedDealershipIsSubDealershipOrSame) {
      this.logger.warn(
        `Unauthorized attempt to update dealership ID: ${dealershipId}`,
      );
      throw new UnauthorizedException();
    }

    return this.dealershipService.updateDealership(
      dealershipId,
      name,
      address,
      parentDealershipId,
    );
  }
}
