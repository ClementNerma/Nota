import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UserCreateDTO {
  @Field()
  passwordHash!: string

  @Field()
  publicKey!: string

  @Field()
  encPublicName!: string

  @Field()
  encPrivateKey!: string
}