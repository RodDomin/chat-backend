import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { FileModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { FriendsModule } from './friends/friends.module';
import { ChatModule } from './chat/chat.module';
import { ApolloDriver } from '@nestjs/apollo';


@Module({
  imports: [
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
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      database: 'test',
      autoLoadEntities: true,
      synchronize: true,
    }),
    FileModule,
    UserModule,
    AuthModule,
    FriendsModule,
    ChatModule
  ],
})
export class AppModule { }
