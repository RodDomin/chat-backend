import { ObjectType, Field, ID } from "@nestjs/graphql";
import { accountValidationDTO } from "./account-validation.dto";
import { ProfilePicDTO } from "./profile.dto";

@ObjectType()
export class UserDTO {
  @Field(() => ID)
  public id: number;

  @Field()
  public email: string;

  @Field()
  public password: string;

  @Field()
  public name: string;

  @Field()
  public status: string;

  @Field(() => accountValidationDTO)
  public accountValidation?: accountValidationDTO;

  @Field(() => ProfilePicDTO)
  public profile?: ProfilePicDTO;

  @Field()
  public createdAt: Date;

  @Field()
  public updatedAt: Date;
}