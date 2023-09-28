import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { StockService } from './features/stocks/stock.service';
import { StockResolver } from './features/stocks/stock.resolver';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { TransactionProducer } from './gateways/queue/transactions/transaction.producer';
import { HttpModule } from '@nestjs/axios';
import { NasdaqAPIService } from './gateways/http/nasdaq/nasdaq-api.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionDatabaseEntity } from './gateways/database/entities/transaction.entity';
import { WalletDatabaseEntity } from './gateways/database/entities/wallet.entity';
import { StockQueriesDAO } from './gateways/database/stock-queries.dao';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),

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
  providers: [
    StockResolver,
    StockService,
    TransactionProducer,
    NasdaqAPIService,
    StockQueriesDAO,
  ],
})
export class AppModule {}
