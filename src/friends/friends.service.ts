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
        { sender: id, status: FRIEND_STATUS.PENDING },
        { recipient: id, status: FRIEND_STATUS.PENDING }
      ],
      relations: ['sender', 'recipient']
    });
  }

  async listFriends(id: number): Promise<Friend[]> {
    return await this.friendRepository.find({
      where: [
        { sender: id, status: FRIEND_STATUS.ACCEPTED },
        { recipient: id, status: FRIEND_STATUS.ACCEPTED }
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

  async accept(id: number): Promise<Friend> {
    const friend_request = await this.friendRepository.findOne(id);

    friend_request.status = FRIEND_STATUS.ACCEPTED;
    friend_request.accepted_date = new Date();

    await friend_request.save();

    return friend_request;
  }
  
  async reject(id: number): Promise<Friend> {
    const friend_request = await this.friendRepository.findOne(id);

    friend_request.status = FRIEND_STATUS.REJECTED;
    friend_request.accepted_date = new Date();

    await friend_request.save();

    return friend_request;
  }

  async findOne(id: number): Promise<Friend> {
    return await this.friendRepository.findOne({
      where: { recipient: id }
    });
  }

  async findBySenderOrRecipient(userId: number, friendId: number): Promise<Friend> {
    return await this.friendRepository.findOne({
      where: [
        { sender: userId, recipient: friendId },
        { sender: friendId, recipient: userId }
      ],
    });
  }

  // async block(userId: number) {}
}
