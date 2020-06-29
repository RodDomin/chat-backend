import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { FriendsResolver } from "./resolvers/friends.resolver";
import { FriendsFilter } from "./exceptions/friends.filter";
import { FriendsService } from './friends.service';
import { Friend } from "./entities/friend.entity";
import { UserModule } from "../user/user.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Friend]),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule)
  ],
  providers: [
    FriendsService,
    FriendsResolver,
    FriendsFilter
  ]
})
export class FriendsModule {}