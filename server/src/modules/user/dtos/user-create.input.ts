import { InputType } from '@nestjs/graphql'

@InputType()
export class UserCreateDTO {
  usernameHash!: string
  passwordHash!: string
  publicKeyJWK!: string
  symKeyEncPrivateKeyJWK!: string
  symKeyEncPrivateKeyIV!: string
  encPublicName!: string
  encPublicNameIV!: string
}
