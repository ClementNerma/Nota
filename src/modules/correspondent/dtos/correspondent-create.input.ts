import { Field, InputType } from '@nestjs/graphql'
import { CorrespondentPermissions } from '../correspondent.entity'

@InputType()
export class CorrespondentCreateInputDTO {
  @Field()
  encDisplayName!: string

  @Field()
  encPublicKeyBase64!: string

  @Field()
  permissions!: CorrespondentPermissions
}