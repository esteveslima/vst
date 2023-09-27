import { Injectable } from '@nestjs/common';
import { StockGraphQLType } from './dtos/types/stock-summary.type';
import { TransactionGraphQLType } from './dtos/types/transaction.type';

@Injectable()
export class StockService {
  purchaseStock(params: {
    user: number;
    shares: number;
    stock: string;
  }): Promise<TransactionGraphQLType> {
    const { shares, stock, user } = params;

    const mockResponse: TransactionGraphQLType = {
      id: 1,
      stock,
      shares,
      user,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return Promise.resolve(mockResponse);
  }

  sellStock(params: {
    user: number;
    shares: number;
    stock: string;
  }): Promise<TransactionGraphQLType> {
    const { shares, stock, user } = params;

    const mockResponse: TransactionGraphQLType = {
      id: 0,
      stock,
      shares,
      user,
      createdAt: new Date(),
      updatedAt: new Date(),
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
