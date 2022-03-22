import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { ForbiddenError } from 'apollo-server-express'
import { v4 } from 'uuid'
import { Viewer } from '../graphql/auth'
import { CorrespondenceToken } from './correspondence-token.entity'
import { Correspondent } from './correspondent.entity'
import {
  CorrespondenceTokenCreateInputDTO,
  getCorrespondenceTokenLifespanInMilliseconds,
} from './dtos/correspondence-token-create.input'
import { CorrespondenceTokenCreatedDTO } from './dtos/correspondence-token-created.dto'
import { CorrespondenceTokenGetDTO } from './dtos/correspondence-token-get.dto'
import { CorrespondenceTokenGetInputDTO } from './dtos/correspondence-token-get.input'
import { CorrespondentCreateInputDTO } from './dtos/correspondent-create.input'
import { CorrespondentCreatedDTO } from './dtos/correspondent-created.dto'
import { CorrespondentRequestInputDTO } from './dtos/correspondent-request.input'

@Injectable()
export class CorrespondentService {
  constructor(
    @InjectRepository(Correspondent) private readonly correspondentRepo: EntityRepository<Correspondent>,
    @InjectRepository(CorrespondenceToken)
    private readonly correspondenceTokenRepo: EntityRepository<CorrespondenceToken>,
  ) {}

  private async _create(
    forUserUuid: string,
    input: CorrespondentCreateInputDTO,
    validated: boolean,
  ): Promise<CorrespondentCreatedDTO> {
    const correspondent = this.correspondentRepo.create({
      apiKey: v4(),
      validated,
      selfPermissions: input.selfPermissions,
      userPermissions: input.userPermissions,
      encDisplayName: input.encDisplayName,
      correspondentPublicKeyJWK: input.correspondentPublicKeyJWK,
      serverUrl: input.serverUrl,
      userApiKey: input.userApiKey,
      associatedTo: forUserUuid,
    })

    await this.correspondentRepo.persistAndFlush(correspondent)
    return correspondent
  }

  async create(viewer: Viewer, input: CorrespondentCreateInputDTO): Promise<CorrespondentCreatedDTO> {
    return this._create(viewer.uuid, input, true)
  }

  async createToken(viewer: Viewer, input: CorrespondenceTokenCreateInputDTO): Promise<CorrespondenceTokenCreatedDTO> {
    const now = new Date()

    const expiresAt = new Date(now.getTime() + getCorrespondenceTokenLifespanInMilliseconds(input.lifespan))

    console.log(getCorrespondenceTokenLifespanInMilliseconds(input.lifespan))

    const correspondenceToken = v4()

    const token = this.correspondenceTokenRepo.create({
      associatedTo: viewer.uuid,
      createdAt: now,
      expiresAt,
      token: correspondenceToken,
    })

    await this.correspondenceTokenRepo.persistAndFlush(token)

    return { correspondenceToken, expiresAt }
  }

  async getCorrespondenceToken(input: CorrespondenceTokenGetInputDTO): Promise<CorrespondenceTokenGetDTO> {
    const correspondenceToken = await this.correspondenceTokenRepo.findOne(input.correspondenceToken, {
      populate: ['associatedTo'],
    })

    if (!correspondenceToken) {
      throw new ForbiddenError('Provided correspondence token was not found')
    }

    return {
      userPublicKeyJWK: correspondenceToken.associatedTo.get().publicKeyJWK,
      expiresAt: correspondenceToken.expiresAt,
    }
  }

  async requestCreation(input: CorrespondentRequestInputDTO): Promise<CorrespondentCreatedDTO> {
    const correspondenceToken = await this.correspondenceTokenRepo.findOne(input.correspondenceToken)

    if (!correspondenceToken) {
      throw new ForbiddenError('The provided correspondence token does not exist')
    }

    if (correspondenceToken.expiresAt.getTime() > Date.now()) {
      throw new ForbiddenError('The provided correspondence token has expired')
    }

    const ret = await this._create(correspondenceToken.associatedTo.uuid, input.correspondentData, false)
    await this.correspondenceTokenRepo.removeAndFlush(correspondenceToken)
    return ret
  }
}
