import { InputType } from '@nestjs/graphql'

@InputType()
export class UserLoginDTO {
  encUsername!: string
  passwordHash!: string
}
