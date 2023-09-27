import { Injectable } from '@nestjs/common';
import { NasdaqAPIService } from '../gateways/http/nasdaq/nasdaq-api.service';

@Injectable()
export class TransactionService {
  constructor(private nasdaqAPIService: NasdaqAPIService) {}

  async handleStockPurchase(params: {
    user: number;
    stock: string;
    shares: number;
    price: number;
  }): Promise<void> {
    const { shares, stock, price, user } = params;

    await this.validateOperation(stock, price);

    return Promise.resolve();
  }

  async handleStockSell(params: {
    user: number;
    stock: string;
    shares: number;
    price: number;
  }): Promise<void> {
    const { shares, stock, price, user } = params;

    await this.validateOperation(stock, price);

    return Promise.resolve();
  }

  //

  private async validateOperation(
    stock: string,
    requestedPrice: number,
  ): Promise<void> {
    const stockData = await this.nasdaqAPIService.getStock(stock);
    const realtimePrice = stockData.price;

    const isValidOperationPrice = requestedPrice === realtimePrice;
    if (!isValidOperationPrice) throw new Error('Prices not matching!');

    return;
  }
}
