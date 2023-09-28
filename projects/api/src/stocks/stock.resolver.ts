import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetStocksSummaryArgsDTO } from './dtos/args/get-stocks-summary-args.dto';
import { StockGraphQLType } from './dtos/types/stock-summary.type';
import { StockService } from './stock.service';
import { TransactionGraphQLType } from './dtos/types/transaction.type';
import { PurchaseStockArgsDTO } from './dtos/args/purchase-stock-args.dto';
import { SellStockArgsDTO } from './dtos/args/sell-stock-args.dto';

@Resolver(() => StockGraphQLType)
export class StockResolver {
  constructor(private stockService: StockService) {}

  @Mutation(() => TransactionGraphQLType)
  async purchaseStock(
    @Args() args: PurchaseStockArgsDTO,
  ): Promise<TransactionGraphQLType> {
    const { shares, stock, user } = args;

    return this.stockService.purchaseStock({ shares, stock, user });
  }

  @Mutation(() => TransactionGraphQLType)
  async sellStock(
    @Args() args: SellStockArgsDTO,
  ): Promise<TransactionGraphQLType> {
    const { shares, stock, user } = args;

    return this.stockService.sellStock({ shares, stock, user });
  }

  @Query(() => [StockGraphQLType])
  async getStocksSummary(
    @Args() args: GetStocksSummaryArgsDTO,
  ): Promise<StockGraphQLType[]> {
    const { user } = args;

    return this.stockService.getStocksSummary({ user });
  }
}
