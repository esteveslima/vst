import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { TransactionService } from './transaction.service';

interface TransactionPayload {
  user: number;
  operation: 'purchase' | 'sell';
  stock: string;
  shares: number;
  price: number;
}

interface TransactionResult {
  status: 'success' | 'failure';
  message?: string;
}

@Processor(process.env.QUEUE_NAME)
export class TransactionConsumer {
  constructor(private transactionService: TransactionService) {}

  @Process()
  async processStockTransaction(
    job: Job<TransactionPayload>,
  ): Promise<TransactionResult> {
    // await sleep(5000); //simulating a processing time for easy visualization in the queue

    try {
      await this.routeTransaction(job);
      return { status: 'success' };
    } catch (exception) {
      return { status: 'failure', message: exception.toString() };
    }
  }

  private async routeTransaction(job: Job<TransactionPayload>): Promise<void> {
    const { operation } = job.data;
    const { price, shares, stock, user } = job.data;

    switch (operation) {
      case 'purchase': {
        return await this.transactionService.handleStockPurchase({
          price,
          shares,
          stock,
          user,
        });
      }
      case 'sell': {
        return await this.transactionService.handleStockSell({
          price,
          shares,
          stock,
          user,
        });
      }
      default: {
        throw new Error(`Invalid transaction operation: "${operation}"`);
      }
    }
  }
}

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(() => resolve(true), ms));
