import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserEntity } from '../user.entity';

export class SaveUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  public static toEntity(dto: SaveUserDto, encryptedPassword: string): UserEntity {
    const entity = new UserEntity();
    entity.email = dto.email;
    entity.username = dto.username;
    entity.password = encryptedPassword;
    return entity;
  }
}
