import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EConfig } from 'src/common/config.enum';
import { getConfig } from 'src/common/util';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthHelper } from './auth.helper';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: getConfig(EConfig.JWT_ACCESS_SECRET_KEY),
      signOptions: { expiresIn: '86400s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthHelper],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
