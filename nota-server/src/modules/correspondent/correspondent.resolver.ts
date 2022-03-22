import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { GqlAuth, GqlPayload, Viewer } from '../graphql/auth'
import { ApiKey, GqlApiKey } from '../graphql/external'
import { Correspondent, ExchangePermissions } from './correspondent.entity'
import { CorrespondentGuard } from './correspondent.guard'
import { CorrespondentService } from './correspondent.service'
import { CorrespondenceTokenCreateInputDTO } from './dtos/correspondence-token-create.input'
import { CorrespondenceTokenCreatedDTO } from './dtos/correspondence-token-created.dto'
import { CorrespondentCreateInputDTO } from './dtos/correspondent-create.input'
import { CorrespondentCreatedDTO } from './dtos/correspondent-created.dto'
import { CorrespondentRequestInputDTO } from './dtos/correspondent-request.input'

@Resolver(Correspondent)
export class CorrespondentResolver {
  constructor(
    private readonly correspondentService: CorrespondentService,
    private readonly correspondentGuard: CorrespondentGuard,
  ) {}

  @Mutation(() => CorrespondentCreatedDTO)
  @GqlAuth()
  async createCorrespondent(
    @GqlPayload() viewer: Viewer,
    @Args('input') input: CorrespondentCreateInputDTO,
  ): Promise<CorrespondentCreatedDTO> {
    return this.correspondentService.create(viewer, input)
  }

  @Mutation(() => CorrespondentCreatedDTO)
  async requestCorrespondentCreation(@Args('input') input: CorrespondentRequestInputDTO) {
    return this.correspondentService.requestCreation(input)
  }

  @Query(() => ExchangePermissions)
  async getPermissions(@GqlApiKey() apiKey: ApiKey): Promise<ExchangePermissions> {
    const correspondent = await this.correspondentGuard.validateApiKey(apiKey)
    return correspondent.selfPermissions
  }
}
