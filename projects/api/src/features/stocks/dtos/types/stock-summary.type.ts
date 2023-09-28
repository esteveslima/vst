import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StockGraphQLType {
  @Field(() => String)
  stock: string;

  @Field(() => Int)
  totalShares: number;

  @Field(() => Float)
  totalValue: number;

  @Field(() => String)
  variationFromPurchase: string;

  @Field(() => Date)
  purchaseDate: Date;

  @Field(() => Float)
  dayMin: number;

  @Field(() => Float)
  dayAvg: number;

  @Field(() => Float)
  dayMax: number;
}
