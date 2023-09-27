import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

interface TransactionPayload {
  user: number;
  operation: 'purchase' | 'sell';
  stock: string;
  shares: number;
  price: number;
}

@Injectable()
export class TransactionProducer {
  constructor(
    @InjectQueue(process.env.QUEUE_NAME)
    private queue: Queue<TransactionPayload>,
  ) {}

  async registerStockTransaction(params: TransactionPayload): Promise<void> {
    const { user, operation, stock, shares, price } = params;

    const job = await this.queue.add({ user, operation, stock, shares, price });

    return;
  }
}
