import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { PaginationInput } from '../../utils/pagination'
import { Correspondent } from '../correspondent/correspondent.entity'
import { GqlAuth, GqlPayload, Viewer } from '../graphql/auth'
import { PaginatedMessages } from '../message/message.resolver'
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

  @Query(() => PaginatedMessages)
  @GqlAuth()
  async myMessages(
    @GqlPayload() viewer: Viewer,
    @Args('paginate') pagination: PaginationInput,
  ): Promise<PaginatedMessages> {
    return this.userService.getMessages(viewer, pagination)
  }
}
