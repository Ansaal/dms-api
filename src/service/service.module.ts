import { Module } from '@nestjs/common';
import { DealershipService } from './dealership/dealership.service';
import { CustomerService } from './customer/customer.service';
import { VehicleService } from './vehicle/vehicle.service';
import { SaleService } from './sale/sale.service';

@Module({
  imports: [],
  exports: [DealershipService, CustomerService, VehicleService, SaleService],
  providers: [DealershipService, CustomerService, VehicleService, SaleService],
})
export class ServiceModule {}
