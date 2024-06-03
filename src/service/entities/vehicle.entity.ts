import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Dealership } from './dealership.entity';
import { Sale } from './sale.entity';

@ObjectType({
  description: 'Vehicle that belongs to a dealership.',
})
export class Vehicle {
  @Field(() => ID)
  vehicleId: string;

  @Field()
  make: string;

  @Field()
  model: string;

  @Field(() => Int)
  year: number;

  @Field(() => Dealership)
  dealership: Dealership;

  @Field(() => Int)
  dealershipId: number;

  @Field(() => [Sale])
  sales: Sale[];
}
