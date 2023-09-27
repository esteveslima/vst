import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class StockProducer {
  constructor(@InjectQueue(process.env.QUEUE_NAME) private queue: Queue) {}

  async registerStockTransaction(params: {
    user: number;
    operation: string;
    stock: string;
    shares: number;
    price: number;
  }): Promise<void> {
    const { user, operation, stock, shares, price } = params;

    const job = await this.queue.add({ user, operation, stock, shares, price });

    return;
  }
}
