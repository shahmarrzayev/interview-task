import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';

@Injectable()
export class UserHelper {
  async hashPassword(password: string): Promise<string> {
    if (!password) return null;

    let hashedPassword: string;
    try {
      hashedPassword = await hash(password);
    } catch (error) {
      return null;
    }

    return hashedPassword;
  }
}
