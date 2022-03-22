import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { GqlAuth, GqlPayload, Viewer } from '../graphql/auth'
import { CorrespondenceToken } from './correspondence-token.entity'
import { CorrespondentService } from './correspondent.service'
import { CorrespondenceTokenCreateInputDTO } from './dtos/correspondence-token-create.input'
import { CorrespondenceTokenCreatedDTO } from './dtos/correspondence-token-created.dto'
import { CorrespondenceTokenGetDTO } from './dtos/correspondence-token-get.dto'
import { CorrespondenceTokenGetInputDTO } from './dtos/correspondence-token-get.input'

@Resolver(CorrespondenceToken)
export class CorrespondenceTokenResolver {
  constructor(private readonly correspondentService: CorrespondentService) {}

  @Mutation(() => CorrespondenceTokenCreatedDTO)
  @GqlAuth()
  async createCorrespondenceToken(
    @GqlPayload() viewer: Viewer,
    @Args('input') input: CorrespondenceTokenCreateInputDTO,
  ): Promise<CorrespondenceTokenCreatedDTO> {
    return this.correspondentService.createToken(viewer, input)
  }

  @Query(() => CorrespondenceTokenGetDTO)
  async getCorrespondenceToken(
    @Args('input') input: CorrespondenceTokenGetInputDTO,
  ): Promise<CorrespondenceTokenGetDTO> {
    return this.correspondentService.getCorrespondenceToken(input)
  }
}
