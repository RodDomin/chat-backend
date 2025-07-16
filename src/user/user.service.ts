import { InjectRepository } from "@nestjs/typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { User } from './entities/user.entity';
import { Repository } from "typeorm";
import { PASSWORD_HASH_PROVIDER, PasswordHashProvider } from "./security/password-hash.provider";

type Users = User[];

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(PASSWORD_HASH_PROVIDER)
    private readonly passwordHashProvider: PasswordHashProvider,
  ) {}

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async findAll(): Promise<Users> {
    return await this.userRepository.find();
  }

  isPasswordValid(user: User, password: string): Promise<boolean> {
    return this.passwordHashProvider.compare(user.password, password);
  }
}