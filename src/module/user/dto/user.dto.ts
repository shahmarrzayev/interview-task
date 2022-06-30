import { UserEntity } from '../user.entity';

export class UserDto {
  id: number;
  email: string;
  username: string;
  cashBalance: number;

  public static fromEntity(entity: UserEntity): UserDto {
    const dto = new UserDto();
    dto.id = entity.id;
    dto.email = entity.email;
    dto.username = entity.username;
    dto.cashBalance = entity.cashBalance;
    return dto;
  }
}
