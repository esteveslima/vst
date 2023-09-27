import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { StockService } from './stocks/stock.service';
import { StockResolver } from './stocks/stock.resolver';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { TransactionProducer } from './gateways/queue/transactions/transaction.producer';
import { HttpModule } from '@nestjs/axios';
import { NasdaqAPIService } from './gateways/http/nasdaq/nasdaq-api.service';

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
  ],
  providers: [
    StockResolver,
    StockService,
    TransactionProducer,
    NasdaqAPIService,
  ],
})
export class AppModule {}
