import { GraphQLError } from 'graphql';

export class FriendsErrors extends GraphQLError {
  constructor(message: string, code: string, status: number) {
    super(
      message,
      { extensions: { code } },
    );
  }
}

export enum FRIENDS_ERROR_CODES {
  USER_DOEST_NOT_HAVE_PERMISSION = 'USER_DOEST_NOT_HAVE_PERMISSION',
  REQUEST_NOT_FOUND = 'FRIEND_REQUEST_NOT_FOUND',
  FRIEND_REQUEST_ALREADY_BE_CREATED = 'FRIEND_REQUEST_ALREADY_BE_CREATED'
}