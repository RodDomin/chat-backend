import { Module, forwardRef } from '@nestjs/common';

import { ChatResolver } from './resolvers/chat.resolver';
import { ChatService } from './chat.service';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { FriendsModule } from 'src/friends/friends.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/messages.entity';
import { Chat } from './entities/chats.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Chat,
      Message,
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => FriendsModule)
  ],
  providers: [ChatService, ChatResolver]
})
export class ChatModule {}