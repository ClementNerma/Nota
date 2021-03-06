import { InputType } from '@nestjs/graphql'
import { ExchangePermissions } from '../correspondent.entity'

@InputType()
export class CorrespondentCreateInputDTO {
  serverUrl!: string
  userApiKey!: string
  encDisplayName!: string
  correspondentPublicKeyJWK!: string
  selfPermissions!: ExchangePermissions
  userPermissions!: ExchangePermissions
}
