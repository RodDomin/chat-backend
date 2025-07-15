import { GraphQLError } from 'graphql';

export class UserErrors extends GraphQLError {
  constructor(message: string, code: string, status: number) {
    super(
      message,
      { extensions: { code } },
    );
  }
}

export enum USER_ERROR_CODES {
  userNotFound = 'USER_NOT_FOUND',
  userDoesNotHavePermission = 'USER_DOES_NOT_HAVE_PERMISSION'
}