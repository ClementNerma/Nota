import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { GqlAuth, GqlPayload, Viewer } from '../graphql/auth'
import { ApiKey, GqlApiKey } from '../graphql/external'
import { Correspondent, CorrespondentPermissions } from './correspondent.entity'
import { CorrespondentGuard } from './correspondent.guard'
import { CorrespondentService } from './correspondent.service'
import { CorrespondentCreateInputDTO } from './dtos/correspondent-create.input'
import { CorrespondentCreatedDTO } from './dtos/correspondent-created.dto'

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

  @Query(() => CorrespondentPermissions)
  async getPermissions(@GqlApiKey() apiKey: ApiKey): Promise<CorrespondentPermissions> {
    const correspondent = await this.correspondentGuard.validateApiKey(apiKey)
    return correspondent.permissions
  }
}
