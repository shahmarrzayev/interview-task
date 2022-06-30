import { Request } from 'express';
import { UserEntity } from 'src/module/user/user.entity';

export interface IRequest extends Request {
  user: UserEntity;
}
