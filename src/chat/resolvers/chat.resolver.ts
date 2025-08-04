import { Resolver, Mutation, Query, Args, Subscription } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';

import { AuthGuard } from 'src/auth/auth.guard';
import { UserId } from 'src/utils/user-id.decorator';

import { ChatDTO } from '../dtos/chat.dto';
import { MessageDTO } from '../dtos/messages.dto';
import { ChatService } from '../chat.service';
import { PUB_SUB_PROVIDER, PubSubProvider } from '../provider/pub-sub.provider';
import { Message } from '../entities/messages.entity';

@Resolver()
export class ChatResolver {
  constructor(
    private readonly chatService: ChatService,
    @Inject(PUB_SUB_PROVIDER)
    private readonly pubSub: PubSubProvider<Message>,
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

    await this.pubSub.publish(`watchMessages:${userToSendMessage}`, message);

    return message;
  }

  @Mutation(() => ChatDTO)
  @UseGuards(AuthGuard)
  public createChat(
    @Args('friendId') friendId: number,
    @UserId() userId: number
  ): Promise<ChatDTO> {
    return this.chatService.findChatOrCreate(userId, friendId);
  }

  @Query(() => [ChatDTO])
  @UseGuards(AuthGuard)
  public listChats(
    @UserId() userId: number
  ): Promise<ChatDTO[]> {
    return this.chatService.findChats(userId);
  }

  @Query(() => [MessageDTO])
  @UseGuards(AuthGuard)
  public listMessages(
    @Args('chatId') chatId: number,
  ): Promise<MessageDTO[]> {
    return this.chatService.findMessages(chatId);
  }

  @Subscription(() => MessageDTO)
  @UseGuards(AuthGuard)
  public async watchMessages(
    @UserId() userId: number
  ) {
    return this.pubSub.watch(`watchMessages:${userId}`)
  }
}
