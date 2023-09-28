import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransactionGraphQLType {
  @Field(() => String)
  operation: string;

  @Field(() => Int)
  user: number;

  @Field(() => String)
  stock: string;

  @Field(() => Int)
  shares: number;

  @Field(() => String)
  status: 'pending' | 'success' | 'failure';
}
