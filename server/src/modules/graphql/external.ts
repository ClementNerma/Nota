import { createParamDecorator } from '@nestjs/common'
import { ForbiddenError } from 'apollo-server-express'
import { IncomingMessage } from 'http'

export const API_KEY_HEADER = 'x-api-key'

export type ApiKey = { apiKey: string }

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
export const GqlApiKey = createParamDecorator((_, { args: [, , ctx] }): ApiKey | undefined => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const req = ctx.req as IncomingMessage
  const apiKey = req.headers[API_KEY_HEADER]

  if (typeof apiKey !== 'string') {
    throw new ForbiddenError('Please provide an API key')
  }

  return { apiKey }
})
