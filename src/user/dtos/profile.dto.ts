import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class ProfilePicDTO {
  @Field(() => ID)
  public id: number;

  @Field()
  public url: string;

  @Field()
  public name: string;

  @Field()
  public originalName: string;
}