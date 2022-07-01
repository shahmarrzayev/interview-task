import { Body, Controller, Post } from '@nestjs/common';
import { SaveUserDto } from './dto/saveUser.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/sign-up')
  async signUp(@Body() dto: SaveUserDto): Promise<UserDto> {
    const user = await this.userService.signUp(dto);
    return UserDto.fromEntity(user);
  }
}
