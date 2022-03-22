import { InputType } from '@nestjs/graphql'

@InputType()
export class CorrespondenceTokenGetInputDTO {
  correspondenceToken!: string
}
