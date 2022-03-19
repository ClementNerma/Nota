import { InputType } from '@nestjs/graphql'
import { ExchangePermissions } from '../correspondent.entity'

@InputType()
export class CorrespondentCreateInputDTO {
  serverUrl!: string
  userApiKey!: string
  encSecretDisplayName!: string
  encSecretKeyJWK!: string
  selfPermissions!: ExchangePermissions
  userPermissions!: ExchangePermissions
}