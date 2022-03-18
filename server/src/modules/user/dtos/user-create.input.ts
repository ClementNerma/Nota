import { InputType } from '@nestjs/graphql'

@InputType()
export class UserCreateDTO {
  usernameHash!: string
  passwordHash!: string
  publicKey!: string
  symKeyEncPrivateKey!: string
  encPublicName!: string
}
