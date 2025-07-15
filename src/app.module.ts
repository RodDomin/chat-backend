import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { FileModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { FriendsModule } from './friends/friends.module';
import { ChatModule } from './chat/chat.module';
import { ApolloDriver } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmFactory } from './config/typeorm.factory';


@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.graphql',
      driver: ApolloDriver,
      subscriptions: {
        'graphql-ws': true
      },
      formatError: (err) => ({
        ...err,
        extensions: {
          ...err.extensions,
          exception: null
        }
      }),
      context: ({ req, connection }) => {
        if (connection?.context) {
          return { req: { headers: connection.context } }
        }

        return { req }
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmFactory,
      inject: [ConfigService]
    }),
    FileModule,
    UserModule,
    AuthModule,
    FriendsModule,
    ChatModule
  ],
})
export class AppModule { }
