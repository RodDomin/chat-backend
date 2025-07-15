import { Resolver, Mutation, Query, Args, Subscription } from '@nestjs/graphql';
import { UseGuards, Inject } from '@nestjs/common';

import { AuthGuard } from 'src/auth/auth.guard';
import { ChatDTO } from '../dtos/chat.dto';
import { MessageDTO } from '../dtos/messages.dto';
import { ChatService } from '../chat.service';
import { GetCurrentUser } from 'src/utils/GetCurrentUser.util';

import { PubSub } from "graphql-subscriptions";

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
    @GetCurrentUser() userId: number
  ): Promise<MessageDTO> {
    const message = await this.chatService.storeMessage(
      content,
      chatId,
      userId
    );

    let userToSendMessage: number;
    const { user1, user2 } = message.chat

    if (user1.id === userId) {
      userToSendMessage = user2.id
    } else {
      userToSendMessage = user1.id
    }

    this.pubSub.publish(`watchMessages:${userToSendMessage}`, { watchMessages: message });

    return message;
  }

  @Mutation(() => ChatDTO)
  @UseGuards(AuthGuard)
  public async createChat(
    @Args('friendId') friendId: number,
    @GetCurrentUser() userId: number
  ): Promise<ChatDTO> {
    const chat = await this.chatService.findChatOrCreate(userId, friendId);

    return chat;
  }

  @Query(() => [ChatDTO])
  @UseGuards(AuthGuard)
  public async listChats(
    @GetCurrentUser() userId: number
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
    @GetCurrentUser() userId: number
  ) {
    return this.pubSub.asyncIterableIterator(`watchMessages:${userId}`)
  }
}
