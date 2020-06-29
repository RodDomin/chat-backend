import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { UseGuards, UseFilters, HttpStatus } from "@nestjs/common";

import { FriendsService } from "../friends.service";
import { AuthGuard } from '../../auth/auth.guard';
import { GetCurrentUser } from "src/utils/GetCurrentUser.util";
import { FriendsFilter } from '../exceptions/friends.filter';
import { FriendDTO } from "../dtos/friend.dto";
import { FriendsErrors, FRIENDS_ERROR_CODES } from "../exceptions/friends.exception";

@Resolver()
export class FriendsResolver {
  constructor(
    private readonly friendsService: FriendsService
  ) {}

  @Mutation(() => FriendDTO)
  @UseGuards(AuthGuard)
  async sendFriendRequest(
    @Args('id') friendId: number,
    @GetCurrentUser() userId: number
  ): Promise<FriendDTO> {
    const requestExists = await this.friendsService.findBySenderOrRecipient(userId, friendId);

    if (requestExists) {
      throw new FriendsErrors(
        'friend request already be created',
        FRIENDS_ERROR_CODES.FRIEND_REQUEST_ALREADY_BE_CREATED,
        HttpStatus.UNAUTHORIZED
      )
    }

    const friend_request = await this.friendsService.store(
      userId,
      friendId
    );

    return friend_request;
  }

  @Mutation(() => FriendDTO)
  @UseGuards(AuthGuard)
  @UseFilters(FriendsFilter)
  async rejectFriend(
    @Args('id') friendId: number,
    @GetCurrentUser() userId: number
  ): Promise<FriendDTO> {
    const request = await this.friendsService.findOne(userId)

    if (!request) {
      throw new FriendsErrors(
        'friend request not found',
        FRIENDS_ERROR_CODES.REQUEST_NOT_FOUND,
        HttpStatus.NOT_FOUND
      )
    }

    const friend_request = await this.friendsService.reject(
      request.id
    );

    return friend_request;
  }

  @Mutation(() => FriendDTO)
  @UseGuards(AuthGuard)
  @UseFilters(FriendsFilter)
  async acceptFriend(
    @Args('id') friendId: number,
    @GetCurrentUser() userId: number
  ): Promise<FriendDTO> {
    const request = await this.friendsService.findOne(userId)

    if (!request) {
      throw new FriendsErrors(
        'friend request not found',
        FRIENDS_ERROR_CODES.REQUEST_NOT_FOUND,
        HttpStatus.NOT_FOUND
      )
    }

    const friend_request = await this.friendsService.accept(
      request.id
    );

    return friend_request;
  }

  @Query(() => [FriendDTO])
  @UseGuards(AuthGuard)
  async listFriendsRequests(
    @GetCurrentUser() userId: number
  ): Promise<FriendDTO[]> {
    const friendsRequests = await this.friendsService.listRequests(userId);

    return friendsRequests;
  }

  @Query(() => [FriendDTO])
  @UseGuards(AuthGuard)
  async listFriends(
    @GetCurrentUser() userId: number
  ): Promise<FriendDTO[]> {
    const friends = await this.friendsService.listFriends(userId);

    return friends;
  }
}