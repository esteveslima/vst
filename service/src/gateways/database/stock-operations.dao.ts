import { Injectable } from '@nestjs/common';
import { EntityManager, MoreThanOrEqual } from 'typeorm';
import { TransactionDatabaseEntity } from './entities/transaction.entity';
import { WalletDatabaseEntity } from './entities/wallet.entity';

@Injectable()
export class StockOperationsDAO {
  constructor(private entityManager: EntityManager) {}

  async registerPurchaseTransaction(params: {
    user: number;
    stock: string;
    shares: number;
    price: number;
  }): Promise<void> {
    const { shares, stock, price, user } = params;
    const operation = 'purchase';
    const status = 'success';

    await this.entityManager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.insert(TransactionDatabaseEntity, [
        {
          operation,
          shares,
          stock,
          price,
          user,
          status,
        },
      ]);

      const isStockWalletAlreadyRegistered =
        await transactionalEntityManager.exists(WalletDatabaseEntity, {
          where: { stock, user },
        });

      if (isStockWalletAlreadyRegistered) {
        await transactionalEntityManager.increment(
          WalletDatabaseEntity,
          { user, stock },
          'shares',
          shares,
        );
        await transactionalEntityManager.increment(
          WalletDatabaseEntity,
          { user, stock },
          'value',
          price * shares,
        );
      } else {
        await transactionalEntityManager.insert(WalletDatabaseEntity, [
          {
            shares,
            stock,
            user,
            value: price * shares,
          },
        ]);
      }
    });

    return;
  }

  async registerSellTransaction(params: {
    user: number;
    stock: string;
    shares: number;
    price: number;
  }): Promise<void> {
    const { shares, stock, price, user } = params;
    const operation = 'sell';
    const status = 'success';

    await this.entityManager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.insert(TransactionDatabaseEntity, {
        operation,
        shares,
        stock,
        price,
        user,
        status,
      });

      await transactionalEntityManager.decrement(
        WalletDatabaseEntity,
        { user, stock },
        'value',
        price * shares,
      );
      const decrementSharesResult = await transactionalEntityManager.decrement(
        WalletDatabaseEntity,
        { user, stock, shares: MoreThanOrEqual(shares) },
        'shares',
        shares,
      );

      const hadEnoughShares = decrementSharesResult.affected === 1;
      if (!hadEnoughShares) {
        throw new Error("There weren't enough shares to sell");
      }
    });

    return;
  }

  async registerFailedPurchaseTransaction(params: {
    user: number;
    stock: string;
    shares: number;
    price: number;
  }): Promise<void> {
    const { shares, stock, price, user } = params;
    const operation = 'purchase';
    const status = 'failure';

    await this.entityManager.insert(TransactionDatabaseEntity, {
      operation,
      shares,
      stock,
      price,
      user,
      status,
    });

    return;
  }

  async registerFailedSellTransaction(params: {
    user: number;
    stock: string;
    shares: number;
    price: number;
  }): Promise<void> {
    const { shares, stock, price, user } = params;
    const operation = 'sell';
    const status = 'failure';

    await this.entityManager.insert(TransactionDatabaseEntity, {
      operation,
      shares,
      stock,
      price,
      user,
      status,
    });

    return;
  }
}
