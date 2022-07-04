import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { hash } from 'argon2';
import { MailService } from '../mail/mail.service';
import { IncreaseBalanceDto } from './dto/increase-balance.dto';
import { SaveUserDto } from './dto/saveUser.dto';
import { UserEntity } from './user.entity';
import { UserHelper } from './user.helper';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userHelper: UserHelper,
    private readonly mailService: MailService,
  ) {}

  private log = new Logger(UserService.name);

  async activate(key: string): Promise<any> {
    this.log.debug('activate -- start');
    if (!key) {
      this.log.debug('activate -- invalid argument(s)');
      throw new InternalServerErrorException('invalid argument(s)');
    }

    const user = await this.userRepository.findByActivateKey(key);
    if (!user) {
      this.log.debug('activate -- user not found');
      throw new InternalServerErrorException('user not found');
    }

    user.activateKey = null;
    user.isActive = true;

    const updatedUser = await this.userRepository.save(user);
    if (!updatedUser) {
      this.log.debug('activate -- user not updated');
      throw new InternalServerErrorException('user not updated');
    }

    this.log.debug('activate -- success');
    return { success: true };
  }

  async create(dto: SaveUserDto): Promise<UserEntity> {
    this.log.debug('create -- start');
    const { email, username, password } = dto || {};
    if (!email || !username || !password) {
      this.log.debug('create -- invalid argument(s)');
      throw new InternalServerErrorException('invalid argument(s)');
    }

    if (await this.emailExists(email)) {
      this.log.debug('create -- email already exists');
      throw new InternalServerErrorException('email already exists');
    }

    if (await this.usernameExists(username)) {
      this.log.debug('create -- username already exists');
      throw new InternalServerErrorException('username already exists');
    }

    const encryptedPassword = await this.userHelper.hashPassword(password);
    if (!encryptedPassword) {
      this.log.error('create -- could not encrypt password');
      throw new InternalServerErrorException('could not encrypt password');
    }

    const entity = SaveUserDto.toEntity(dto, encryptedPassword);
    entity.activateKey = await this.generateActivateKey(entity.email);

    const user = await this.userRepository.save(entity);
    if (!user) {
      this.log.error('create -- could not save user');
      throw new InternalServerErrorException('could not save user');
    }

    this.log.debug('create -- success');
    return user;
  }

  async increaseBalance(user: UserEntity, dto: IncreaseBalanceDto): Promise<UserEntity> {
    this.log.debug('increaseBalance -- start');
    if (!user || !dto) {
      this.log.debug('increaseBalance -- invalid argument(s)');
      throw new InternalServerErrorException('invalid argument(s)');
    }

    const entity = await this.userRepository.findById(user.id);
    if (!entity) {
      this.log.debug('increaseBalance -- user not found');
      throw new InternalServerErrorException('user not found');
    }

    entity.cashBalance += dto.amount;

    const updatedUser = await this.userRepository.save(entity);
    if (!updatedUser) {
      this.log.debug('increaseBalance -- user not updated');
      throw new InternalServerErrorException('user not updated');
    }

    this.log.debug('increaseBalance -- success');
    return updatedUser;
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

  private async generateActivateKey(email: string): Promise<string> {
    if (!email) return null;
    let key = await hash(email, { hashLength: 64 });
    key = key.replace(/\//g, '-');
    await this.mailService.sendActivateKey(email, key);
    return key;
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
