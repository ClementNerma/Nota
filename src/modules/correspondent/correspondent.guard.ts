import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { ForbiddenError, UserInputError } from 'apollo-server-express'
import { ViewerMaybe } from '../graphql/auth'
import { ApiKey } from '../graphql/external'
import { UserGuard } from '../user/user.guard'
import { Correspondent } from './correspondent.entity'

@Injectable()
export class CorrespondentGuard {
  constructor(
    @InjectRepository(Correspondent)
    private readonly correspondentRepo: EntityRepository<Correspondent>,
    private readonly userGuard: UserGuard,
  ) {}

  async validateApiKey(apiKey: ApiKey): Promise<Correspondent> {
    const correspondent = await this.correspondentRepo.findOne(apiKey)

    if (!correspondent) {
      throw new ForbiddenError('Invalid API key provided')
    }

    return correspondent
  }

  async getViewerCorrespondent(viewer: ViewerMaybe, correspondentUuid: string): Promise<Correspondent> {
    const user = await this.userGuard.validateViewer(viewer)

    const correspondent = await this.correspondentRepo.findOne({ uuid: correspondentUuid })

    if (!correspondent || correspondent.associatedTo.uuid !== user.uuid) {
      throw new UserInputError('Provided correspondent was not found')
    }

    return correspondent
  }
}
