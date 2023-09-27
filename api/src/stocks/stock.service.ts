import { Injectable } from '@nestjs/common';
import { StockGraphQLType } from './dtos/types/stock-summary.type';
import { TransactionGraphQLType } from './dtos/types/transaction.type';
import { StockProducer } from '../gateways/queue/queue.producer';

@Injectable()
export class StockService {
  constructor(private stockProducer: StockProducer) {}

  purchaseStock(params: {
    user: number;
    shares: number;
    stock: string;
  }): Promise<TransactionGraphQLType> {
    const { shares, stock, user } = params;
    const operation = 'purchase';

    this.stockProducer.registerStockTransaction({
      operation,
      shares,
      stock,
      user,
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

  sellStock(params: {
    user: number;
    shares: number;
    stock: string;
  }): Promise<TransactionGraphQLType> {
    const { shares, stock, user } = params;
    const operation = 'sell';

    this.stockProducer.registerStockTransaction({
      operation,
      shares,
      stock,
      user,
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

  getStocksSummary(params: { user: number }): StockGraphQLType[] {
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

    return mockResponse;
  }
}
