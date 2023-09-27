import { Module } from '@nestjs/common';
import { TransactionConsumer } from './gateways/queue/transactions/transaction.consumer';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { HttpModule } from '@nestjs/axios';
import { TransactionService } from './transaction/transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockOperationsDAO } from './gateways/database/stock-operations.dao';
import { TransactionDatabaseEntity } from './gateways/database/entities/transaction.entity';
import { WalletDatabaseEntity } from './gateways/database/entities/wallet.entity';

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

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      // leaving these below to simplify
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([TransactionDatabaseEntity, WalletDatabaseEntity]),
  ],
  providers: [TransactionConsumer, TransactionService, StockOperationsDAO],
})
export class AppModule {}
