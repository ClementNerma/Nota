import { Field, InputType } from '@nestjs/graphql'
import { ExchangePermissions } from '../correspondent.entity'

@InputType()
export class CorrespondentCreateInputDTO {
  @Field()
  encDisplayName!: string

  @Field()
  encPublicKey!: string

  @Field()
  selfPermissions!: ExchangePermissions

  @Field()
  userPermissions!: ExchangePermissions
}
