import { InputType } from '@nestjs/graphql'

@InputType()
export class UserCreateDTO {
  passwordHash!: string
  publicKey!: string
  encUsername!: string
  encPublicName!: string
  encPrivateKey!: string
}
