import { StockEntity } from './../stock/stock.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ name: 'cash_balance' })
  cashBalance: number;

  @Column({ name: 'activate_key' })
  activateKey: string;

  @Column({ name: 'is_active', default: false })
  isActive: boolean;

  @OneToMany(() => StockEntity, (stock) => stock.userId)
  @JoinColumn({ name: 'user_id' })
  stocks: StockEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
