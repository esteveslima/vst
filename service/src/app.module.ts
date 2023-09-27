import { Module } from '@nestjs/common';
import { TransactionConsumer } from './gateways/queue/transactions/transaction.consumer';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { HttpModule } from '@nestjs/axios';
import { TransactionService } from './transaction/transaction.service';
import { NasdaqAPIService } from './gateways/http/nasdaq/nasdaq-api.service';

@Module({
  imports: [
    HttpModule,

    BullModule.forRoot({
      redis: {
        host: process.env.QUEUE_REDIS_HOST,
        port: +process.env.QUEUE_REDIS_PORT,
        db: +process.env.QUEUE_REDIS_DB,
      },
    }),
    BullModule.registerQueue({
      name: process.env.QUEUE_NAME,
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    BullBoardModule.forFeature({
      name: process.env.QUEUE_NAME,
      adapter: BullMQAdapter,
    }),
  ],
  providers: [TransactionConsumer, NasdaqAPIService, TransactionService],
})
export class AppModule {}
