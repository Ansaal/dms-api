import { Module } from '@nestjs/common';
import { DealershipResolver } from './dealership/dealership.resolver';
import { ServiceModule } from '../../service/service.module';
import { CustomerResolver } from './customer/customer.resolver';
import { SaleResolver } from './sale/sale.resolver';
import { VehicleResolver } from './vehicle/vehicle.resolver';

@Module({
  providers: [
    DealershipResolver,
    CustomerResolver,
    SaleResolver,
    VehicleResolver,
  ],
  imports: [ServiceModule],
})
export class GraphqlModule {}
