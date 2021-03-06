import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthenticationError } from 'apollo-server-express'
import { GqlAuth, GqlPayload, Viewer, ViewerMaybe } from '../graphql/auth'
import { UserLoginDTO } from '../user/dtos/user-login.input'
import { User } from '../user/user.entity'
import { UserService } from '../user/user.service'
import { AuthService } from './auth.service'
import { LoggedInDTO } from './dtos/logged-in.dto'

@Resolver()
export class AuthResolver {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  @Query(() => User, { nullable: true })
  @GqlAuth(true)
  async viewer(@GqlPayload() viewer: ViewerMaybe): Promise<Viewer | null> {
    if (viewer === undefined) {
      return null
    }

    return this.userService.findByUuid(viewer.uuid)
  }

  @Mutation(() => LoggedInDTO)
  async login(@Args('input') input: UserLoginDTO): Promise<LoggedInDTO> {
    const user = await this.authService.login(input.usernameHash, input.passwordHash)

    if (user === null) {
      throw new AuthenticationError('Bad credentials provided')
    }

    return user
  }
}
