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
