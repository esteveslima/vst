import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class StockProducer {
  constructor(@InjectQueue(process.env.QUEUE_NAME) private queue: Queue) {}

  async registerStockTransaction(params: {
    operation: string;
    user: number;
    shares: number;
    stock: string;
  }): Promise<void> {
    const { operation, shares, stock, user } = params;

    const job = await this.queue.add({ operation, shares, stock, user });

    return;
  }
}
