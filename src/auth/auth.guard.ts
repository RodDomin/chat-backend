import { CanActivate, Injectable, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from '@nestjs/graphql';

import { AuthError, AuthRestError } from './auth.exception';
import { AUTH_CODES } from './codes/auth.codes';
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context)

    const { authorization } = ctx.getContext().req.headers;

    const req = ctx.getContext().req;

    if (!authorization) {
      throw new AuthError(AUTH_CODES.invalidToken);
    }

    const [, token] = authorization.split(' ');

    const validToken = await this.authService.validateToken(token);

    req.userId = validToken.id;

    return validToken;
  }
}

@Injectable()
export class AuthGuardRest implements CanActivate {
  constructor(
    private authService: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;

    if (!authorization) {
      throw new AuthRestError()
    }

    const [, token] = authorization.split(' ');

    const validToken = await this.authService.validateToken(token);

    request.userId = validToken.id;

    return true;
  }
}