import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EConfig } from 'src/common/config.enum';
import { getConfig } from 'src/common/util';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthHelper } from './auth.helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly authHelper: AuthHelper,
    private readonly jwtService: JwtService,
  ) {}

  private readonly log = new Logger(AuthService.name);

  async login(user: UserEntity): Promise<{ access_token: string }> {
    this.log.debug('login -- start');
    if (!user || !user.isActive) {
      this.log.debug('login -- user is not active');
      throw new InternalServerErrorException('user is not active');
    }

    const payload = { id: user.id, email: user.email, isActive: user.isActive };
    const accessToken = this.jwtService.sign(payload, {
      secret: getConfig(EConfig.JWT_ACCESS_SECRET_KEY),
    });
    this.log.debug('login -- success');
    return { access_token: accessToken };
  }

  async validateUser(email: string, password: string): Promise<UserEntity> {
    this.log.debug('validateUser -- start');
    if (!email || !password) {
      this.log.debug('validateUser -- invalid argument(s)');
      throw new InternalServerErrorException('invalid argument(s)');
    }

    let user: UserEntity;
    try {
      user = await this.userService.getByEmail(email);
    } catch (error) {
      return null;
    }

    const isCorrectPassword = await this.authHelper.verifyPassword(user.password, password);
    if (!isCorrectPassword) {
      this.log.debug('validateUser -- invalid password');
      throw new UnauthorizedException('Wrong email or passworfd');
    }
    this.log.debug('validateUser -- success');
    return user;
  }
}
