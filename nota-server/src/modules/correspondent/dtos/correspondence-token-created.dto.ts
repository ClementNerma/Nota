import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CorrespondenceTokenCreatedDTO {
  @Field()
  correspondenceToken!: string

  @Field()
  expiresAt!: Date
}
