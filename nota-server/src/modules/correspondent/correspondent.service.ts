import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { v4 } from 'uuid'
import { Viewer } from '../graphql/auth'
import { Correspondent } from './correspondent.entity'
import { CorrespondentCreateInputDTO } from './dtos/correspondent-create.input'
import { CorrespondentCreatedDTO } from './dtos/correspondent-created.dto'

@Injectable()
export class CorrespondentService {
  constructor(@InjectRepository(Correspondent) private readonly correspondentRepo: EntityRepository<Correspondent>) {}

  async create(viewer: Viewer, input: CorrespondentCreateInputDTO): Promise<CorrespondentCreatedDTO> {
    const correspondent = this.correspondentRepo.create({
      apiKey: v4(),
      selfPermissions: input.selfPermissions,
      userPermissions: input.userPermissions,
      encDisplayName: input.encDisplayName,
      encKeyJWK: input.encKeyJWK,
      serverUrl: input.serverUrl,
      userApiKey: input.userApiKey,
      associatedTo: viewer.uuid,
    })

    await this.correspondentRepo.persistAndFlush(correspondent)
    return correspondent
  }
}
