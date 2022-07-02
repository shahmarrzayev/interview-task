import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EConfig } from 'src/common/config.enum';
import { getConfig } from 'src/common/util';
import { MailService } from './mail.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: getConfig(EConfig.EMAIL_HOST),
        port: 465,
        auth: {
          user: getConfig(EConfig.EMAIL_USER),
          pass: getConfig(EConfig.EMAIL_PASSWORD),
        },
        secure: true,
      },
      defaults: {
        from: `Activation Code <${getConfig(EConfig.EMAIL_USER)}>`,
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
