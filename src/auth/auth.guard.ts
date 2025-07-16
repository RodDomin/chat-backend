import { CanActivate, Injectable, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from '@nestjs/graphql';

import { AuthError } from './auth.exception';
import { AUTH_CODES } from './codes/auth.codes';
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = context.switchToHttp().getRequest();

    const authorization = ctx.getContext().req.headers.authorization 
      ?? request.headers.authorization;

    const req = ctx.getContext().req;

    if (!authorization) {
      throw new AuthError(AUTH_CODES.invalidToken);
    }

    const [, token] = authorization.split(' ');

    const validToken = await this.authService.validateToken(token);

    req.userId = validToken.id;

    return !!validToken;
  }
}
