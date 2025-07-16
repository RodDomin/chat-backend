import { Resolver, Mutation, Query, Args, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PubSub } from "graphql-subscriptions";

import { AuthGuard } from 'src/auth/auth.guard';
import { UserId } from 'src/utils/user-id.decorator';

import { ChatDTO } from '../dtos/chat.dto';
import { MessageDTO } from '../dtos/messages.dto';
import { ChatService } from '../chat.service';

@Resolver()
export class ChatResolver {
  private pubSub = new PubSub();

  constructor(
    private readonly chatService: ChatService
  ) {}

  @Mutation(() => MessageDTO)
  @UseGuards(AuthGuard)
  public async sendMessage(
    @Args('chatId') chatId: number,
    @Args('content') content: string,
    @UserId() userId: number
  ): Promise<MessageDTO> {
    const message = await this.chatService.storeMessage(
      content,
      chatId,
      userId
    );

    const { user1, user2 } = message.chat

    const userToSendMessage = user1.id === userId
      ? user2.id
      : user1.id;

    this.pubSub.publish(`watchMessages:${userToSendMessage}`, { watchMessages: message });

    return message;
  }

  @Mutation(() => ChatDTO)
  @UseGuards(AuthGuard)
  public async createChat(
    @Args('friendId') friendId: number,
    @UserId() userId: number
  ): Promise<ChatDTO> {
    const chat = await this.chatService.findChatOrCreate(userId, friendId);

    return chat;
  }

  @Query(() => [ChatDTO])
  @UseGuards(AuthGuard)
  public async listChats(
    @UserId() userId: number
  ): Promise<ChatDTO[]> {
    const chats = await this.chatService.findChats(userId);

    return chats;
  }

  @Query(() => [MessageDTO])
  @UseGuards(AuthGuard)
  public async listMessages(
    @Args('chatId') chatId: number,
  ): Promise<MessageDTO[]> {
    const messages = await this.chatService.findMessages(chatId);

    return messages;
  }

  @Subscription(() => MessageDTO)
  @UseGuards(AuthGuard)
  public async watchMessages(
    @UserId() userId: number
  ) {
    return this.pubSub.asyncIterableIterator(`watchMessages:${userId}`)
  }
}
