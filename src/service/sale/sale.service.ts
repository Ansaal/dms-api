import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Sale } from '../entities/sale.entity';

@Injectable()
export class SaleService {
  private readonly logger = new Logger(SaleService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new sale transaction.
   * @param date - The date of the sale.
   * @param purchaseNetAmount - The net amount of the purchase.
   * @param vehicleId - The ID of the vehicle being sold.
   * @param customerId - The ID of the customer buying the vehicle.
   * @param dealershipId - The dealership ID where the sale is made.
   * @returns Promise<Sale> - The created sale transaction.
   */
  async createSale(
    date: Date,
    purchaseNetAmount: number,
    vehicleId: string,
    customerId: string,
    dealershipId: string,
  ): Promise<Sale> {
    this.logger.log(
      `Creating sale on ${date} with amount ${purchaseNetAmount} for vehicle ID: ${vehicleId}, customer ID: ${customerId} in dealership ID: ${dealershipId}`,
    );
    const sale = await this.prisma.sale.create({
      data: { date, vehicleId, customerId, dealershipId, purchaseNetAmount },
    });
    return this.getSaleById(sale.saleId, dealershipId);
  }

  /**
   * Retrieves a sale transaction by its ID and dealership ID.
   * @param saleId - The ID of the sale transaction.
   * @param dealershipId - The dealership ID to filter the sale by.
   * @returns Promise<Sale | null> - The sale transaction or null if not found.
   */
  async getSaleById(
    saleId: string,
    dealershipId: string,
  ): Promise<Sale | null> {
    this.logger.log(
      `Fetching sale ID: ${saleId} for dealership ID: ${dealershipId}`,
    );
    const sale = await this.prisma.sale.findFirst({
      where: { saleId, dealershipId },
      include: { vehicle: true, customer: true, dealership: true },
    });
    return sale as unknown as Sale | null;
  }

  /**
   * Retrieves all sales for a specific dealership.
   * @param dealershipId - The dealership ID to filter sales by.
   * @returns Promise<Sale[]> - A list of sales for the specified dealership.
   */
  async getSalesByDealershipId(dealershipId: string): Promise<Sale[]> {
    this.logger.log(`Fetching sales for dealership ID: ${dealershipId}`);
    return this.prisma.sale.findMany({
      where: { dealershipId },
      include: { vehicle: true, customer: true, dealership: true },
    }) as unknown as Sale[];
  }

  /**
   * Updates an existing sale transaction.
   * This usually shouldn't be used as Sales should be immutable.
   * @param saleId - The ID of the sale to update.
   * @param date - The updated date of the sale.
   * @param purchaseNetAmount - The updated purchase net amount.
   * @param vehicleId - The updated vehicle ID.
   * @param customerId - The updated customer ID.
   * @param dealershipId - The updated dealership ID.
   * @returns Promise<Sale> - The updated sale transaction.
   */
  async updateSale(
    saleId: string,
    date: Date,
    purchaseNetAmount: number,
    vehicleId: string,
    customerId: string,
    dealershipId: string,
  ): Promise<Sale> {
    this.logger.log(
      `Updating sale ID: ${saleId} in dealership ID: ${dealershipId}`,
    );
    const sale = await this.prisma.sale.update({
      where: { saleId, dealershipId },
      data: { date, vehicleId, customerId, dealershipId, purchaseNetAmount },
    });
    return sale as unknown as Sale;
  }

  /**
   * Deletes a sale transaction by its ID and dealership ID.
   * @param saleId - The ID of the sale transaction to delete.
   * @param dealershipId - The dealership ID to filter the sale by.
   * @returns Promise<Sale> - The deleted sale transaction.
   */
  async deleteSale(saleId: string, dealershipId: string): Promise<Sale> {
    this.logger.log(
      `Deleting sale ID: ${saleId} for dealership ID: ${dealershipId}`,
    );
    const sale = await this.prisma.sale.delete({
      where: { saleId, dealershipId },
    });
    return sale as unknown as Sale;
  }
}
