import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

interface TransactionPayload {
  user: number;
  operation: 'purchase' | 'sell';
  stock: string;
  shares: number;
  price: number;
}

@Processor(process.env.QUEUE_NAME)
export class TransactionConsumer {
  @Process()
  async processStockTransaction(job: Job<TransactionPayload>): Promise<void> {
    await sleep(5000); //simulating a processing time for easy visualization in the queue
    return;
  }
}

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(() => resolve(true), ms));
