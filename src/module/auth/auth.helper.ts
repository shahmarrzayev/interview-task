import { Injectable, Logger } from '@nestjs/common';
import { verify } from 'argon2';

@Injectable()
export class AuthHelper {
  private readonly logger = new Logger(AuthHelper.name);

  async verifyPassword(hash: string, password: string): Promise<boolean> {
    this.logger.debug('verifyPassword -- start');
    if (!hash || !password) {
      return false;
    }

    let isCorrectPassword = false;
    try {
      isCorrectPassword = await verify(hash, password);
    } catch (error) {
      this.logger.error(`verifyPassword -- ${error}`);
      return false;
    }

    this.logger.debug('verifyPassword -- success');
    return isCorrectPassword;
  }
}
