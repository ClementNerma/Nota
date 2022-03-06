import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { UserCreateDTO } from './dtos/user-create.dto'
import { User } from './user.entity'
import { UserService } from './user.service'

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async register(@Args('input') dto: UserCreateDTO): Promise<User> {
    return this.userService.create(dto)
  }
}
