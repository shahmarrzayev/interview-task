import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  private readonly log = new Logger(MailService.name);

  async sendActivationEmail(email: string, key: string): Promise<any> {
    if (!email || !key) return null;
    this.log.debug('sendActivationEmail -- start');
    console.log();
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Your account activation code',
        template: process.cwd() + '/src/templates/user-activation.hbs',
        context: {
          url: `https://exmo-app.herokuapp.com/api/activate/${key}`,
        },
      });
    } catch (error) {
      this.log.warn(`sendActivationEmail -- error sending activation email: ${error}`);
      console.log('error', error);
      throw new InternalServerErrorException();
    }

    this.log.debug('sendActivationEmail -- success');
  }
}
