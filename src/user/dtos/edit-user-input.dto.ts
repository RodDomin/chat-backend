import { ObjectType, Field, InputType } from "@nestjs/graphql";

@InputType()
export class EditUserInputDTO {
  @Field({ nullable: true })
  status: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  user_name: string;
}