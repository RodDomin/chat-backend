import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Message } from './entities/messages.entity';
import { Chat } from './entities/chats.entity';
import { User } from 'src/user/entities';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>
  ) {}

  async findChatOrCreate(userId: number, friendId: number): Promise<Chat> {
    const chat = await this.chatRepository.findOne({
      where: [
        { user1: userId, user2: friendId },
        { user1: friendId, user2: userId }
      ]
    });

    if (!chat) {
      const newChat = new Chat();
      const user = await User.findOne(userId);
      const friend = await User.findOne(friendId);

      newChat.user1 = user;
      newChat.user2 = friend;

      await newChat.save();

      return newChat;
    }

    return chat;
  }

  async storeMessage(content: string, chatId: number, userId: number): Promise<Message> {
    const chat = await this.chatRepository.findOne(chatId, {
      relations: ['user1', 'user2']
    });
    const user = await User.findOne(userId);

    const message = new Message();
    message.content = content;
    message.chat = chat;
    message.sender = user;

    await message.save();

    return message;
  }

  async findChats(userId: number): Promise<Chat[]> {
    const chats = await this.chatRepository.find({
      where: [
        { user1: userId },
        { user2: userId }
      ],
      relations: ['user1', 'user2']
    });

    return chats;
  }

  async findMessages(chatId: number): Promise<Message[]> {
    const messages = await this.messageRepository.find({
      where: { chat: chatId },
      order: { createdAt: 'ASC' },
      relations: ['sender']
    });

    return messages;
  }
}
