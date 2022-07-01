import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EConfig } from 'src/common/config.enum';
import { getConfig } from 'src/common/util';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthHelper } from './auth.helper';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  imports: [
    ConfigModule,
    UserModule,
    JwtModule.register({
      secret: getConfig(EConfig.JWT_ACCESS_SECRET_KEY),
      signOptions: { expiresIn: '86400s' },
    }),
  ],
  providers: [AuthHelper, AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
