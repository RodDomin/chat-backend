import { HttpException } from "@nestjs/common";
import { GraphQLError } from "graphql";

export class AuthError extends GraphQLError {
  constructor (code: string) {
    super(
      'authentication error',
      {
        extensions: {
          code,
        }
      },
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