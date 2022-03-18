import { Field, ObjectType } from '@nestjs/graphql'
import { User } from '../../user/user.entity'

@ObjectType()
export class LoggedInDTO {
  @Field()
  accessToken!: string

  @Field()
  viewer!: User
}
