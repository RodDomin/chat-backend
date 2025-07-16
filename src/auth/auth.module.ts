import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from './auth.constants';
import { AuthGuard, AuthGuardRest } from './auth.guard';
import { AuthService } from "./auth.service";
import { AuthResolver } from "./resolvers/auth.resolver";
import { UserModule } from "src/user/user.module";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') ?? jwtConstants.secret,
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN') ?? jwtConstants.expiresIn
        }
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, AuthResolver, AuthGuard, AuthGuardRest],
  exports: [AuthService, AuthGuard, AuthGuardRest]
})
export class AuthModule { }