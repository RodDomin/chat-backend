import { UserService } from '../user/user.service';
import { AuthError } from './auth.exception';
import { Inject, Injectable } from '@nestjs/common';
import { AUTH_CODES } from './codes/auth.codes';
import { AuthDTO } from './dtos/auth.dto';
import { AUTH_PROVIDER, AuthProvider } from './provider/auth.provider';
import { AuthPayload } from './auth.payload';

interface LoginParams {
  email: string,
  password: string,
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @Inject(AUTH_PROVIDER)
    private readonly authProvider: AuthProvider<AuthPayload>,
  ) {}

  async login({ email, password }: LoginParams): Promise<AuthDTO> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new AuthError(AUTH_CODES.userNotFound);
    }

    const isPasswordValid = await this.userService.isPasswordValid(user, password);

    if (!isPasswordValid) {
      throw new AuthError(AUTH_CODES.wrongPassword);
    }

    const payload = { id: user.id };

    const token = this.authProvider.createToken(payload);
    const refreshToken = this.authProvider.createRefreshToken(payload);

    return {
      token,
      refreshToken,
      user
    };
  }

  async validateToken(token: string): Promise<AuthPayload> {
    const data = await this.authProvider.validateToken(token);

    if (!data) {
      throw new AuthError(AUTH_CODES.invalidToken);
    }

    return data;
  }
}