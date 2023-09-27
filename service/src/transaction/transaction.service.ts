import { Injectable } from '@nestjs/common';
import { StockOperationsDAO } from '../gateways/database/stock-operations.dao';

@Injectable()
export class TransactionService {
  constructor(private stockOperationsDAO: StockOperationsDAO) {}

  async handleStockPurchase(params: {
    user: number;
    stock: string;
    shares: number;
    price: number;
  }): Promise<void> {
    const { shares, stock, price, user } = params;

    try {
      await this.stockOperationsDAO.registerPurchaseTransaction({
        shares,
        stock,
        price,
        user,
      });
    } catch (exception) {
      await this.stockOperationsDAO.registerFailedPurchaseTransaction({
        shares,
        stock,
        price,
        user,
      });

      throw exception;
    }

    return;
  }

  async handleStockSell(params: {
    user: number;
    stock: string;
    shares: number;
    price: number;
  }): Promise<void> {
    const { shares, stock, price, user } = params;

    try {
      await this.stockOperationsDAO.registerSellTransaction({
        shares,
        stock,
        price,
        user,
      });
    } catch (exception) {
      await this.stockOperationsDAO.registerFailedSellTransaction({
        shares,
        stock,
        price,
        user,
      });

      throw exception;
    }

    return;
  }
}
