import { ApolloError } from 'apollo-server-express';

export class UserErrors extends ApolloError {
  constructor(message: string, code: string, status: number) {
    super(
      message,
      code,
      { status },
    );
  }
}

export enum USER_ERROR_CODES {
  userNotFound = 'USER_NOT_FOUND',
  userDoesNotHavePermission = 'USER_DOES_NOT_HAVE_PERMISSION'
}