import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';

@ArgsType()
export class GetStocksSummaryArgsDTO {
  @Field(() => Int)
  @Min(1)
  user: number; // Simply simulating an user, in a real application this would be handle by authentication
}
