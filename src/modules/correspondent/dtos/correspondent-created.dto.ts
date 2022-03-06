import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CorrespondentCreatedDTO {
  @Field()
  apiKey!: string
}
