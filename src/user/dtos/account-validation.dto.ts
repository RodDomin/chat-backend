import { ObjectType, Field, ID } from "@nestjs/graphql";
import { UserDTO } from "./user.dto";

@ObjectType()
export class accountValidationDTO {
  @Field(() => ID)
  public id: string;

  @Field()
  public token: string

  @Field()
  public isValid: boolean;

  @Field()
  public validDate: Date;

  @Field(() => UserDTO, { nullable: true })
  public user: UserDTO;

  @Field()
  public user_id: string;

  @Field()
  public createdAt: Date;

  @Field()
  public updatedAt: Date;
}