import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UserLoginDTO {
  @Field()
  uuid!: string

  @Field()
  passwordHash!: string
}
