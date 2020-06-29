import { Field, ObjectType } from "@nestjs/graphql";
import { UserDTO } from "src/user/dtos/user.dto";
import { ChatDTO } from "./chat.dto";

@ObjectType()
export class MessageDTO {
  @Field()
  public id: number;

  @Field()
  public content: string;

  @Field()
  public see: boolean

  @Field(() => UserDTO)
  public sender: UserDTO

  @Field(() => ChatDTO)
  public chat: ChatDTO

  @Field()
  public createdAt: Date;

  @Field()
  public updatedAt: Date;
}