import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Sale } from './sale.entity';
import { Dealership } from './dealership.entity';

@ObjectType({
  description:
    'Person that is interested in buying or has bought a vehicle. Belongs to a single dealership.',
})
export class Customer {
  @Field(() => ID)
  customerId: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  phone: string;

  @Field(() => Dealership)
  dealership: Dealership;

  @Field(() => [Sale], { defaultValue: [] })
  sales: Sale[];
}
