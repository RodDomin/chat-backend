import { ObjectType, Field } from "@nestjs/graphql";
import { UserDTO } from "src/user/dtos/user.dto";

@ObjectType()
export class ChatDTO {
  @Field()
  public id: number;

  @Field(() => UserDTO)
  public user1: UserDTO

  @Field(() => UserDTO)
  public user2: UserDTO

  @Field()
  public createdAt: Date;

  @Field()
  public updatedAt: Date;
}