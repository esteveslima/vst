import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class TransactionDatabaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user: number;

  @Column()
  operation: 'purchase' | 'sell';

  @Column()
  stock: string;

  @Column()
  shares: number;

  @Column({ type: 'double' })
  price: number;

  @Column()
  status: 'pending' | 'success' | 'failure';

  @CreateDateColumn()
  createdAt: Date;
}
