import { InputType } from '@nestjs/graphql'

@InputType()
export class UserLoginDTO {
  usernameHash!: string
  passwordHash!: string
}
