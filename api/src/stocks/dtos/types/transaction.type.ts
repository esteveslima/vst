import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransactionGraphQLType {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  user: number;

  @Field(() => String)
  stock: string;

  @Field(() => Int)
  shares: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
