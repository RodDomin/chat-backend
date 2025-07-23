import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { UseGuards, UseFilters, HttpStatus } from "@nestjs/common";

import { FriendsService } from "../friends.service";
import { AuthGuard } from '../../auth/auth.guard';
import { UserId } from "src/utils/user-id.decorator";
import { FriendsFilter } from '../exceptions/friends.filter';
import { FriendDTO } from "../dtos/friend.dto";
import { FriendsErrors, FRIENDS_ERROR_CODES } from "../exceptions/friends.exception";
import { Friend } from "../entities/friend.entity";

@Resolver()
@UseGuards(AuthGuard)
export class FriendsResolver {
  constructor(
    private readonly friendsService: FriendsService
  ) {}

  @Mutation(() => FriendDTO)
  async sendFriendRequest(
    @Args('id') requestedId: number,
    @UserId() userId: number
  ): Promise<FriendDTO> {
    const requestExists = await this.friendsService.findBySenderOrRecipient(userId, requestedId);

    if (requestExists) {
      throw new FriendsErrors(
        'the relationship between these users already exist created',
        FRIENDS_ERROR_CODES.FRIEND_REQUEST_ALREADY_BE_CREATED,
        HttpStatus.UNAUTHORIZED
      );
    }

    const friendRequest = await this.friendsService.store(
      userId,
      requestedId
    );

    return friendRequest;
  }

  @Mutation(() => FriendDTO)
  @UseFilters(FriendsFilter)
  async rejectFriend(
    @Args('id') requestedId: number,
    @UserId() userId: number
  ): Promise<FriendDTO> {
    return this.updateFriendStatus(
      await this.friendsService.findFriendRequest(userId, requestedId), 
      'reject'
    );
  }

  @Mutation(() => FriendDTO)
  @UseFilters(FriendsFilter)
  async acceptRequest(
    @Args('id') requestedId: number,
    @UserId() userId: number
  ): Promise<FriendDTO> {
    return this.updateFriendStatus(
      await this.friendsService.findFriendRequest(userId, requestedId), 
      'accept'
    );
  }

  private async updateFriendStatus(request: Friend, newStatus: 'accept' | 'reject') {
    if (!request) {
      throw new FriendsErrors(
        'friend request not found',
        FRIENDS_ERROR_CODES.REQUEST_NOT_FOUND,
        HttpStatus.NOT_FOUND
      )
    }

    const friendRequest = await this.friendsService[newStatus](
      request.id
    );

    return friendRequest;
  }

  @Query(() => [FriendDTO])
  async listFriendsRequests(
    @UserId() userId: number
  ): Promise<FriendDTO[]> {
    const friendsRequests = await this.friendsService.listRequests(userId);

    return friendsRequests;
  }

  @Query(() => [FriendDTO])
  async listFriends(
    @UserId() userId: number
  ): Promise<FriendDTO[]> {
    const friends = await this.friendsService.listFriends(userId);

    return friends;
  }
}