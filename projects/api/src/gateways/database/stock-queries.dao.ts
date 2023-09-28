import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { WalletDatabaseEntity } from './entities/wallet.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StockQueriesDAO {
  constructor(
    @InjectRepository(WalletDatabaseEntity)
    private walletRepository: Repository<WalletDatabaseEntity>,
  ) {}

  async getFullWallet(user: number): Promise<WalletDatabaseEntity[]> {
    const result = await this.walletRepository.find({ where: { user } });

    if (result.length === 0)
      throw new Error(`No stocks found for user ${user}`);

    return result;
  }
}
