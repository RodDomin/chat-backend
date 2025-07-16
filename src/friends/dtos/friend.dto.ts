import { ObjectType, Field } from "@nestjs/graphql";
import { User } from "src/user/entities";
import { UserDTO } from "src/user/dtos/user.dto";

@ObjectType()
export class FriendDTO {
  @Field()
  public id: number;

  @Field(() => UserDTO)
  public sender: User;

  @Field(() => UserDTO)
  public recipient: User;

  @Field({ nullable: true })
  public accepted_date: Date;

  @Field()
  public status: string;

  @Field()
  public createdAt: Date;

  @Field()
  public updatedAt: Date;
}
