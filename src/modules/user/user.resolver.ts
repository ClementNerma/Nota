import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { Correspondent } from '../correspondent/correspondent.entity'
import { GqlAuth, GqlPayload, Viewer } from '../graphql/auth'
import { Message } from '../message/message.entity'
import { UserCreateDTO } from './dtos/user-create.input'
import { User } from './user.entity'
import { UserService } from './user.service'

@Resolver(User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @ResolveField()
  async correspondents(@Parent() user: User): Promise<Correspondent[]> {
    return user.correspondents.loadItems()
  }

  @Mutation(() => User)
  async register(@Args('input') dto: UserCreateDTO): Promise<User> {
    return this.userService.create(dto)
  }

  @Query(() => [Message])
  @GqlAuth()
  async myMessages(@GqlPayload() viewer: Viewer): Promise<Message[]> {
    return this.userService.getMessages(viewer)
  }
}
