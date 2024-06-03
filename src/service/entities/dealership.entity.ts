import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Vehicle } from './vehicle.entity';
import { Sale } from './sale.entity';
import { Customer } from './customer.entity';

@ObjectType({
  description:
    'Organization that is specialized in vehicle sales, that can have multiple subsidiaries or be a subsidiary itself',
})
export class Dealership {
  @Field(() => ID)
  dealershipId: string;

  @Field()
  name: string;

  @Field()
  address: string;

  @Field(() => Dealership, { nullable: true })
  parentDealership?: Dealership;

  @Field(() => ID, { nullable: true })
  parentDealershipId?: string;

  @Field(() => [Dealership], { defaultValue: [] })
  subDealerships: Dealership[];

  @Field(() => [Vehicle], { defaultValue: [] })
  vehicles: Vehicle[];

  @Field(() => [Customer], { defaultValue: [] })
  customers: Customer[];

  @Field(() => [Sale], { defaultValue: [] })
  sales: Sale[];
}
