import { Injectable } from '@nestjs/common';
import { StockGraphQLType } from './dtos/types/stock-summary.type';
import { TransactionGraphQLType } from './dtos/types/transaction.type';
import { TransactionProducer } from '../../gateways/queue/transactions/transaction.producer';
import { NasdaqAPIService } from '../../gateways/http/nasdaq/nasdaq-api.service';
import { StockQueriesDAO } from '../../gateways/database/stock-queries.dao';

@Injectable()
export class StockService {
  constructor(
    private transactionProducer: TransactionProducer,
    private nasdaqAPIService: NasdaqAPIService,
    private stockQueriesDAO: StockQueriesDAO,
  ) {}

  async purchaseStock(params: {
    user: number;
    shares: number;
    stock: string;
  }): Promise<TransactionGraphQLType> {
    const { shares, stock, user } = params;
    const operation = 'purchase';

    const stockData = await this.nasdaqAPIService.getStock(stock);
    const { price } = stockData;

    this.transactionProducer.produceStockTransaction({
      user,
      operation,
      stock,
      shares,
      price,
    });

    return {
      operation,
      stock,
      shares,
      user,
      status: 'pending',
    };
  }

  async sellStock(params: {
    user: number;
    shares: number;
    stock: string;
  }): Promise<TransactionGraphQLType> {
    const { shares, stock, user } = params;
    const operation = 'sell';

    const stockData = await this.nasdaqAPIService.getStock(stock);
    const { price } = stockData;

    this.transactionProducer.produceStockTransaction({
      user,
      operation,
      stock,
      shares,
      price,
    });

    return {
      operation,
      stock,
      shares,
      user,
      status: 'pending',
    };
  }

  async getStocksSummary(params: {
    user: number;
  }): Promise<StockGraphQLType[]> {
    const { user } = params;

    const userStocksWallet = await this.stockQueriesDAO.getFullWallet(user);

    const stockAndWalledDataPromises = userStocksWallet.map(
      async (stockWallet) => ({
        walletData: stockWallet,
        stockData: await this.nasdaqAPIService.getStock(stockWallet.stock),
      }),
    );

    const stockAndWalledData = await Promise.all(stockAndWalledDataPromises);

    const formattedResult = stockAndWalledData.map<StockGraphQLType>((data) => {
      const sharesAmount = data.walletData.shares
      const ownedSharesTotalValue = data.walletData.value;
      const currentPriceSharesTotalValue = data.stockData.price * sharesAmount;
      const sharePriceVariation = 1 - (ownedSharesTotalValue / currentPriceSharesTotalValue);

      const currentSharePriceAvg =
        (data.stockData.dayMax + data.stockData.dayMin) / 2;

      return {
        stock: data.walletData.stock,
        totalShares: data.walletData.shares,
        totalValue: +parseFloat(`${data.walletData.value}`).toFixed(2),
        purchaseDate: data.walletData.purchaseDate,
        dayMin: +parseFloat(`${data.stockData.dayMin}`).toFixed(2),
        dayAvg: +parseFloat(`${currentSharePriceAvg}`).toFixed(2),
        dayMax: +parseFloat(`${data.stockData.dayMax}`).toFixed(2),
        variationFromPurchase:
          parseFloat(`${sharePriceVariation * 100}`).toFixed(2) + '%',
      };
    });

    return formattedResult;
  }
}
