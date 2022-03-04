import { Inject } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthenticationError } from 'apollo-server-express'
import { GqlAuth, ViewerUuid } from '../graphql/auth'
import { UserLoginDTO } from '../user/dtos/user-login.dto'
import { User } from '../user/user.entity'
import { UserService } from '../user/user.service'
import { AuthService } from './auth.service'

@Resolver()
export class AuthResolver {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,

    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  @Query(() => User, { nullable: true })
  @GqlAuth(true)
  async viewer(@ViewerUuid() viewerUuid?: string): Promise<User | null> {
    return viewerUuid !== undefined ? this.userService.findByUuid(viewerUuid) : null
  }

  @Mutation(() => String)
  async login(@Args('input') input: UserLoginDTO): Promise<string> {
    const user = await this.authService.login(input.uuid, input.passwordHash)

    if (user === null) {
      throw new AuthenticationError('Bad credentials provided')
    }

    return user
  }
}