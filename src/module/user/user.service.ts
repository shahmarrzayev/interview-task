import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { SaveUserDto } from './dto/saveUser.dto';
import { UserEntity } from './user.entity';
import { UserHelper } from './user.helper';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userHelper: UserHelper,
  ) {}

  private log = new Logger(UserService.name);

  async signUp(dto: SaveUserDto): Promise<UserEntity> {
    this.log.debug('signUp -- start');
    const { email, username, password } = dto || {};
    if (!email || !username || !password) {
      this.log.debug('signUp -- invalid argument(s)');
      throw new InternalServerErrorException('invalid argument(s)');
    }

    if (await this.emailExists(email)) {
      this.log.debug('signUp -- email already exists');
      throw new InternalServerErrorException('email already exists');
    }

    if (await this.usernameExists(username)) {
      this.log.debug('signUp -- username already exists');
      throw new InternalServerErrorException('username already exists');
    }

    const encryptedPassword = await this.userHelper.hashPassword(password);
    if (!encryptedPassword) {
      this.log.error('signUp -- could not encrypt password');
      throw new InternalServerErrorException('could not encrypt password');
    }

    const entity = SaveUserDto.toEntity(dto, encryptedPassword);
    const user = await this.userRepository.save(entity);
    if (!user) {
      this.log.error('signUp -- could not save user');
      throw new InternalServerErrorException('could not save user');
    }

    this.log.debug('signUp -- success');
    return user;
  }

  async getById(id: number): Promise<UserEntity> {
    this.log.debug('getById -- start');
    if (!id) {
      this.log.debug('getById -- invalid argument(s)');
      throw new InternalServerErrorException('invalid argument(s)');
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      this.log.debug('getById -- user not found');
      throw new InternalServerErrorException('user not found');
    }

    this.log.debug('getById -- success');
    return user;
  }

  async getByEmail(email: string): Promise<UserEntity> {
    this.log.debug('getByEmail -- start');
    if (!email) {
      this.log.debug('getByEmail -- invalid argument(s)');
      throw new InternalServerErrorException('invalid argument(s)');
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      this.log.debug('getByEmail -- user not found');
      throw new InternalServerErrorException('user not found');
    }

    this.log.debug('getByEmail -- success');
    return user;
  }

  async getByUsername(username: string): Promise<UserEntity> {
    this.log.debug('getByUsername -- start');
    if (!username) {
      this.log.debug('getByUsername -- invalid argument(s)');
      throw new InternalServerErrorException('invalid argument(s)');
    }

    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      this.log.debug('getByUsername -- user not found');
      throw new InternalServerErrorException('user not found');
    }

    this.log.debug('getByUsername -- success');
    return user;
  }

  private async emailExists(email: string): Promise<boolean> {
    const exists = await this.userRepository.findByEmail(email);
    return !!exists;
  }

  private async usernameExists(username: string): Promise<boolean> {
    const exists = await this.userRepository.findByUsername(username);
    return !!exists;
  }
}
