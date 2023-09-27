import { Injectable } from '@nestjs/common';
import { StockGraphQLType } from './dtos/types/stock-summary.type';
import { TransactionGraphQLType } from './dtos/types/transaction.type';
import { TransactionProducer } from '../gateways/queue/transactions/transaction.producer';
import { NasdaqAPIService } from '../gateways/http/nasdaq/nasdaq-api.service';

@Injectable()
export class StockService {
  constructor(
    private transactionProducer: TransactionProducer,
    private nasdaqAPIService: NasdaqAPIService,
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

    this.transactionProducer.registerStockTransaction({
      user,
      operation,
      stock,
      shares,
      price,
    });

    const mockResponse: TransactionGraphQLType = {
      operation,
      stock,
      shares,
      user,
      status: 'pending',
    };

    return Promise.resolve(mockResponse);
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

    this.transactionProducer.registerStockTransaction({
      user,
      operation,
      stock,
      shares,
      price,
    });

    const mockResponse: TransactionGraphQLType = {
      operation,
      stock,
      shares,
      user,
      status: 'pending',
    };

    return Promise.resolve(mockResponse);
  }

  async getStocksSummary(params: {
    user: number;
  }): Promise<StockGraphQLType[]> {
    const { user } = params;

    const mockResponse: StockGraphQLType[] = [
      {
        dayAvg: 5,
        dayMax: 10,
        dayMin: 1,
        purchaseDate: new Date(),
        stock: 'stock',
        totalShares: 100,
        totalValue: 1000,
        variationFromPurchase: 0.01,
      },
    ];

    return Promise.resolve(mockResponse);
  }
}
