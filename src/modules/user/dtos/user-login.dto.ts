import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UserLoginDTO {
  @Field()
  encUsername!: string

  @Field()
  passwordHash!: string
}
