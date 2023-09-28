import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, Min } from 'class-validator';

@ArgsType()
export class PurchaseStockArgsDTO {
  @Field(() => Int)
  @Min(1)
  user: number; // Simply simulating an user, in a real application this would be handle by authentication

  @Field(() => String)
  @IsNotEmpty()
  stock: string;

  @Field(() => Int)
  @Min(1)
  shares: number;
}
