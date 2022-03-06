import { applyDecorators, createParamDecorator, ExecutionContext, Injectable, UseGuards } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { JwtPayload } from '../auth/auth.service'

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext): unknown {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return GqlExecutionContext.create(context).getContext().req
  }
}

@Injectable()
export class GqlOptionalAuthGuard extends GqlAuthGuard {
  override handleRequest<TUser>(err: unknown, user: TUser | false): TUser | false {
    return user
  }
}

export type Viewer = JwtPayload
export type ViewerMaybe = JwtPayload | undefined

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const GqlAuth = (allowUnauth?: boolean) =>
  applyDecorators(UseGuards(allowUnauth !== true ? GqlAuthGuard : GqlOptionalAuthGuard))

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
export const GqlPayload = createParamDecorator((data, { args: [, , ctx] }): JwtPayload | undefined => ctx.req?.user)
