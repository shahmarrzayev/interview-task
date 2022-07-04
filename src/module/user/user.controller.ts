import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { SaveUserDto } from './dto/saveUser.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { IRequest } from '../auth/interface/request.interface';
import { IncreaseBalanceDto } from './dto/increase-balance.dto';

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/sign-up')
  async create(@Body() dto: SaveUserDto): Promise<UserDto> {
    const user = await this.userService.create(dto);
    return UserDto.fromEntity(user);
  }

  @Get('/activate/:key')
  async activate(@Param('key') key: string): Promise<UserDto> {
    const user = await this.userService.activate(key);
    return UserDto.fromEntity(user);
  }

  @Put('/increase-balance')
  async increaseBalance(@Req() req: IRequest, @Body() dto: IncreaseBalanceDto): Promise<UserDto> {
    const user = await this.userService.increaseBalance(req.user, dto);
    return UserDto.fromEntity(user);
  }
}
