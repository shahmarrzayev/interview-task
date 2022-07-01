import { MailerModule } from '@nestjs-modules/mailer';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from './module/auth/auth.middleware';

import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { getConfig } from './common/util';
import { EConfig } from './common/config.enum';
import { MailModule } from './module/mail/mail.module';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forRoot(), AuthModule, UserModule, MailModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/api/user/*', method: RequestMethod.ALL },
        { path: '/api/stock/*', method: RequestMethod.ALL },
      );
  }
}
