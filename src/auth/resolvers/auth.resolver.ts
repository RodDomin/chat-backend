import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { AuthService } from "../auth.service";
import { AuthDTO } from "../dtos/auth.dto";

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService
  ) {}

  @Mutation(() => AuthDTO)
  async login(
    @Args('email') email: string,
    @Args('password') password: string
  ): Promise<AuthDTO> {
    const token = await this.authService.login({ email, password });

    return token;
  }
}