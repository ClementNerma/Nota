import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CorrespondenceTokenGetDTO {
  @Field()
  userPublicKeyJWK!: string

  @Field()
  expiresAt!: Date
}
