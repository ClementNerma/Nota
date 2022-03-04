import { applyDecorators, createParamDecorator, ExecutionContext, Injectable, UseGuards } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'

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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const GqlAuth = (allowUnauth?: boolean) =>
  applyDecorators(UseGuards(allowUnauth !== true ? GqlAuthGuard : GqlOptionalAuthGuard))

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
export const GqlPayload = createParamDecorator((data, { args: [, , ctx] }) => ctx.req?.user ?? null)

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
export const ViewerUuid = createParamDecorator((data, { args: [, , ctx] }) => (ctx.req?.user ?? null)?.uuid)
