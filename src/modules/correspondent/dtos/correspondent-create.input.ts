import { Field, InputType } from '@nestjs/graphql'
import { ExchangePermissions } from '../correspondent.entity'

@InputType()
export class CorrespondentCreateInputDTO {
  @Field()
  serverUrl!: string

  @Field()
  userApiKey!: string

  @Field()
  encDisplayName!: string

  @Field()
  encPublicKey!: string

  @Field()
  selfPermissions!: ExchangePermissions

  @Field()
  userPermissions!: ExchangePermissions
}
