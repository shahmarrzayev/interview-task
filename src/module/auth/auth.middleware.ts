import { IRequest } from './interface/request.interface';
import { ForbiddenException, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { getConfig } from '../../common/util';
import { EConfig } from '../../common/config.enum';
import { UserEntity } from '../user/user.entity';
import { AuthHelper } from './auth.helper';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService, private readonly authHelper: AuthHelper) {}

  private readonly logger = new Logger(AuthMiddleware.name);

  async use(req: IRequest, res: Response, next: NextFunction) {
    this.logger.debug('use -- start');
    const bearerHeader = req.headers.authorization;
    const accessToken = bearerHeader && bearerHeader.split(' ')[1];
    if (!bearerHeader || !accessToken) {
      this.logger.warn('use -- no token');
      return next();
    }

    let user: UserEntity;
    try {
      const { id }: any = verify(accessToken, getConfig(EConfig.JWT_ACCESS_SECRET_KEY));
      user = await this.userService.getById(id);
    } catch (error) {
      this.logger.error(`${JSON.stringify(error)}`);
      throw new ForbiddenException('Please register or sign in.');
    }

    if (user && user.isActive) {
      req.user = user;
    }
    this.logger.debug('use -- success');
    next();
  }
}
