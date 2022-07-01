import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '../mail/mail.module';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserHelper } from './user.helper';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), MailModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserHelper],
  exports: [UserService],
})
export class UserModule {}
