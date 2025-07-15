import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Friend } from './entities/friend.entity';
import { UserService } from 'src/user/user.service';
import { FRIEND_STATUS } from './utils/friends.util';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    private readonly userService: UserService
  ) {}

  async listRequests(id: number): Promise<Friend[]> {
    return await this.friendRepository.find({
      where: [
        { sender: { id }, status: FRIEND_STATUS.PENDING },
        { recipient: { id }, status: FRIEND_STATUS.PENDING }
      ],
      relations: ['sender', 'recipient']
    });
  }

  async listFriends(id: number): Promise<Friend[]> {
    return await this.friendRepository.find({
      where: [
        { sender: { id }, status: FRIEND_STATUS.ACCEPTED },
        { recipient: { id }, status: FRIEND_STATUS.ACCEPTED }
      ],
      relations: ['sender', 'recipient']
    });
  }

  async store(userId: number, friendId: number): Promise<Friend> {
    const friend = new Friend();

    const user = await this.userService.findOne(userId);
    const future_friend = await this.userService.findOne(friendId);

    friend.sender = user;
    friend.recipient = future_friend;

    await friend.save();

    return friend;
  }

  accept(id: number): Promise<Friend> {
    return this.updateFriendStatus(id, FRIEND_STATUS.ACCEPTED);
  }
  
  reject(id: number): Promise<Friend> {
    return this.updateFriendStatus(id, FRIEND_STATUS.REJECTED);
  }

  private async updateFriendStatus(id: number, status: FRIEND_STATUS) {
    const friendRequest = await this.friendRepository.findOneBy({ id });

    friendRequest.status = status;
    friendRequest.accepted_date = new Date();

    await friendRequest.save();

    return friendRequest;
  }

  async findOne(id: number): Promise<Friend> {
    return await this.friendRepository.findOne({
      where: { recipient: { id } }
    });
  }

  async findBySenderOrRecipient(userId: number, friendId: number): Promise<Friend> {
    return await this.friendRepository.findOne({
      where: [
        { sender: { id: userId }, recipient: { id: friendId } },
        { sender: { id: friendId }, recipient: { id: userId } }
      ],
    });
  }

  // async block(userId: number) {}
}
