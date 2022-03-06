import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { ForbiddenError } from 'apollo-server-express'
import { ApiKey } from '../graphql/external'
import { Correspondent } from './correspondent.entity'

@Injectable()
export class CorrespondentGuard {
  constructor(
    @InjectRepository(Correspondent)
    private readonly correspondentRepo: EntityRepository<Correspondent>,
  ) {}

  async validateApiKey(apiKey: ApiKey): Promise<Correspondent> {
    const correspondent = await this.correspondentRepo.findOne(apiKey)

    if (!correspondent) {
      throw new ForbiddenError('Invalid API key provided')
    }

    return correspondent
  }
}
