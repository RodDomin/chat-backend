import { ObjectType, Field } from "@nestjs/graphql";
import { UserDTO } from "src/user/dtos/user.dto";

@ObjectType()
export class AuthDTO {
  @Field()
  token: string;

  @Field()
  refreshToken: string;

  @Field(() => UserDTO)
  user: UserDTO;
}
