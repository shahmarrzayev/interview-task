import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GenericRepository } from 'src/common/repository';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository extends GenericRepository {
  constructor(@InjectRepository(UserEntity) private repository: Repository<UserEntity>) {
    super();
  }

  async findById(id: number): Promise<UserEntity> {
    if (!id) return null;
    return await this.runQuery(() =>
      this.repository.createQueryBuilder('user').where('user.id = :id', { id }).getOne(),
    );
  }

  async findByEmail(email: string): Promise<UserEntity> {
    if (!email) return null;
    return await this.runQuery(() =>
      this.repository.createQueryBuilder('user').where('user.email = :email', { email }).getOne(),
    );
  }

  async findByUsername(username: string): Promise<UserEntity> {
    if (!username) return null;
    return await this.runQuery(() =>
      this.repository
        .createQueryBuilder('user')
        .where('user.username = :username', { username })
        .getOne(),
    );
  }

  async save(user: UserEntity): Promise<UserEntity> {
    if (!user) return null;
    return await this.runQuery(() => this.repository.save(user));
  }
}
