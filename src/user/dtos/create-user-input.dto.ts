import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInputDTO {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true, defaultValue: 'Disponível' })
  status: string;

  @Field({ nullable: false })
  name: string;
}