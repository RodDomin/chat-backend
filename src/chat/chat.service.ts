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
  ) { }

  async findChatOrCreate(userId: number, friendId: number): Promise<Chat> {
    const chat = await this.chatRepository.findOne({
      where: [
        { user1: { id: userId }, user2: { id: friendId } },
        { user1: { id: friendId }, user2: { id: userId } }
      ]
    });

    return chat ?? await this.create(userId, friendId);
  }

  private async create(userId: number, friendId: number) {
    const newChat = new Chat();

    const user1 = await User.findOneBy({ id: userId });
    const user2 = await User.findOneBy({ id: friendId });

    newChat.user1 = user1;
    newChat.user2 = user2;

    await newChat.save();

    return newChat;
  }

  async storeMessage(content: string, chatId: number, userId: number): Promise<Message> {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['user1', 'user2'],
    });

    const user = await User.findOneBy({ id: userId });

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
        { user1: { id: userId } },
        { user2: { id: userId } }
      ],
      relations: ['user1', 'user2']
    });

    return chats;
  }

  async findMessages(chatId: number): Promise<Message[]> {
    const messages = await this.messageRepository.find({
      where: { chat: { id: chatId } },
      order: { createdAt: 'ASC' },
      relations: ['sender']
    });

    return messages;
  }
}
