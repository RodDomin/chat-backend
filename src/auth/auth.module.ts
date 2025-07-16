import { Module, forwardRef } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { jwtConstants } from './auth.constants';
import { AuthGuard } from './auth.guard';
import { AuthService } from "./auth.service";
import { AuthResolver } from "./resolvers/auth.resolver";
import { UserModule } from "src/user/user.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AUTH_PROVIDER } from "./provider/auth.provider";
import { JwtAuthProvider } from "./provider/jwt-auth.provider";

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
  providers: [
    AuthService,
    AuthResolver,
    AuthGuard,
    {
      provide: AUTH_PROVIDER,
      useFactory: (service: JwtService) => new JwtAuthProvider(service),
      inject: [JwtService]
    }
  ],
  exports: [AuthService, AuthGuard]
})
export class AuthModule { }