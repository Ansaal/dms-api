import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Vehicle } from './vehicle.entity';
import { Customer } from './customer.entity';
import { Dealership } from './dealership.entity';

@ObjectType({
  description: 'Record of a Sale-transaction.',
})
export class Sale {
  @Field(() => ID)
  saleId: string;

  @Field()
  date: Date;

  @Field()
  purchaseNetAmount: number;

  @Field(() => Vehicle)
  vehicle: Vehicle;

  @Field(() => Int)
  vehicleId: number;

  @Field(() => Customer)
  customer: Customer;

  @Field(() => Int)
  customerId: number;

  @Field(() => Dealership)
  dealership: Dealership;

  @Field(() => Int)
  dealershipId: number;
}
