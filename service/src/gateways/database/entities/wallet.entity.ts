import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class WalletDatabaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user: number;

  @Column()
  stock: string;

  @Column()
  shares: number;

  @Column({ type: 'double' })
  value: number;

  @CreateDateColumn()
  purchaseDate: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
