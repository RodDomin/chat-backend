import { UserService } from '../user/user.service';
import { AuthError } from './auth.exception';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { AUTH_CODES } from './codes/auth.codes';
import { AuthDTO } from './dtos/auth.dto';

interface LoginParams {
  email: string,
  password: string,
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async login({ email, password }: LoginParams): Promise<AuthDTO> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new AuthError(AUTH_CODES.userNotFound);
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new AuthError(AUTH_CODES.wrongPassword);
    }

    const token = this.jwtService.sign({ id: user.id });

    return {
      token,
      user
    };
  }

  async validateToken(token: string): Promise<any> {
    try {
      const data = await this.jwtService.verify(token);
  
      return data;
    } catch (err) {
      throw new AuthError(AUTH_CODES.invalidToken);
    }
  }
}