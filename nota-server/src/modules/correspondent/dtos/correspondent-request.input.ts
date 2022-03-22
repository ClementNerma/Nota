import { InputType } from '@nestjs/graphql'
import { CorrespondentCreateInputDTO } from './correspondent-create.input'

@InputType()
export class CorrespondentRequestInputDTO {
  correspondenceToken!: string
  correspondentData!: CorrespondentCreateInputDTO
}
