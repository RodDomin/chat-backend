import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from './auth.constants';
import { AuthGuard, AuthGuardRest } from './auth.guard';
import { AuthService } from "./auth.service";
import { AuthResolver } from "./resolvers/auth.resolver";
import { UserModule } from "src/user/user.module";
 
@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn }
    }),
  ],
  providers: [AuthService, AuthResolver, AuthGuard, AuthGuardRest],
  exports: [AuthService, AuthGuard, AuthGuardRest]
})
export class AuthModule {}