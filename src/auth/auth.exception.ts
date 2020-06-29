import { ApolloError } from "apollo-server-express";
import { HttpException } from "@nestjs/common";

export class AuthError extends ApolloError {
  constructor (code: string) {
    super(
      'authentication error',
      code,
    )
  }
}

export class AuthRestError extends HttpException {
  constructor() {
    super(
      'User not authenticated',
      401
    )
  }
}