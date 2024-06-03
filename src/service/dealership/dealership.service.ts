import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Dealership } from '../entities/dealership.entity';

@Injectable()
export class DealershipService {
  private readonly logger = new Logger(DealershipService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Retrieves dealerships that are ancestors of the given parent dealership ID.
   *
   * @param {string} parentDealershipId - The ID of the parent dealership.
   * @returns {Promise<Dealership[]>} List of ancestor dealerships.
   */
  async getDealerships(parentDealershipId: string): Promise<Dealership[]> {
    const ancestorDealerships = await this.prisma.$queryRaw<
      {
        dealershipId: string;
        name: string;
        parentDealershipId: string | null;
      }[]
    >`
        WITH RECURSIVE Ancestors AS (
            SELECT "dealershipId", "name", "parentDealershipId" FROM "Dealership" WHERE "dealershipId" = ${parentDealershipId}
            UNION ALL
            SELECT d."dealershipId", d."name", d."parentDealershipId"
            FROM "Dealership" d
                     INNER JOIN Ancestors a ON a."dealershipId" = d."parentDealershipId"
        )
        SELECT * FROM Ancestors; 
    `;

    const ids = ancestorDealerships.map((d) => d.dealershipId);

    return this.prisma.dealership.findMany({
      where: {
        dealershipId: {
          in: ids,
        },
      },
      include: {
        subDealerships: true,
        // We don't want to give back these potentially long lists of vehicles
        // or sales or customers to the client.
        vehicles: false,
        sales: false,
        customers: false,
      },
    }) as unknown as Dealership[];
  }

  /**
   * Retrieves a dealership by its ID.
   *
   * @param {string} dealershipId - The ID of the dealership.
   * @returns {Promise<Dealership | null>} The dealership or null if not found.
   */
  async getDealershipById(dealershipId: string): Promise<Dealership | null> {
    return this.prisma.dealership.findUnique({
      where: { dealershipId },
      include: {
        subDealerships: true,
        // We can give it back here, since it's just one dealership that's requested
        vehicles: true,
        sales: true,
        customers: true,
      },
    }) as unknown as Dealership | null;
  }

  /**
   * Creates a new dealership.
   *
   * @param {string} name - The name of the new dealership.
   * @param {string} address - The address of the new dealership.
   * @param {string} [parentDealershipId] - The optional ID of the parent dealership.
   * @returns {Promise<Dealership>} The created dealership.
   */
  async createDealership(
    name: string,
    address: string,
    parentDealershipId?: string,
  ): Promise<Dealership> {
    return this.prisma.dealership.create({
      data: { name, parentDealershipId, address },
    }) as unknown as Dealership;
  }

  /**
   * Updates an existing dealership.
   *
   * @param {string} dealershipId - The ID of the dealership to update.
   * @param {string} name - The new name for the dealership.
   * @param {string} address - The new address for the dealership.
   * @param {string} [parentDealershipId] - The optional new parent dealership ID.
   * @returns {Promise<Dealership>} The updated dealership.
   */
  async updateDealership(
    dealershipId: string,
    name: string,
    address: string,
    parentDealershipId?: string,
  ): Promise<Dealership> {
    return this.prisma.dealership.update({
      where: { dealershipId },
      data: { name, parentDealershipId, address },
    }) as unknown as Dealership;
  }

  /**
   * Checks if a dealership is an ancestor of another dealership.
   *
   * @param {string} parentDealershipId - The ID of the potential ancestor dealership.
   * @param {string} childDealershipId - The ID of the potential child dealership.
   * @returns {Promise<boolean>} True if the parent is an ancestor of the child, otherwise false.
   */
  async isAncestor(
    parentDealershipId: string,
    childDealershipId: string,
  ): Promise<boolean> {
    this.logger.log(
      `Checking if dealership ID: ${parentDealershipId} is an ancestor of dealership ID: ${childDealershipId}`,
    );

    const childDealership = await this.prisma.dealership.findUnique({
      where: { dealershipId: childDealershipId },
      select: { parentDealershipId: true },
    });

    if (!childDealership || !childDealership.parentDealershipId) {
      return false;
    }

    if (childDealership.parentDealershipId === parentDealershipId) {
      return true;
    }

    return this.isAncestor(
      parentDealershipId,
      childDealership.parentDealershipId,
    );
  }

  /**
   * Validates if the user has access to the target dealership.
   * @param userDealershipId - The dealership ID from the user's token.
   * @param targetDealershipId - The target dealership ID to validate access.
   * @returns Promise<boolean> - True if the user has access, otherwise false.
   */
  async validateDealershipAccess(
    userDealershipId: string,
    targetDealershipId: string,
  ): Promise<boolean> {
    this.logger.log(
      `Validating access for user dealership ID: ${userDealershipId} to target dealership ID: ${targetDealershipId}`,
    );

    if (userDealershipId === targetDealershipId) {
      return true;
    }

    const subDealerships = await this.prisma.$queryRaw<
      { dealershipId: string }[]
    >`
        WITH RECURSIVE SubDealerships AS (
            SELECT "dealershipId", "parentDealershipId" FROM "Dealership" WHERE "dealershipId" = ${userDealershipId}
            UNION ALL
            SELECT d."dealershipId", d."parentDealershipId"
            FROM "Dealership" d
                     INNER JOIN SubDealerships sd ON d."parentDealershipId" = sd."dealershipId"
        )
        SELECT "dealershipId" FROM SubDealerships WHERE "dealershipId" = ${targetDealershipId}
    `;

    const hasAccess = subDealerships.length > 0;
    this.logger.log(`Access validation result: ${hasAccess}`);
    return hasAccess;
  }
}
