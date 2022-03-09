import { InputType } from '@nestjs/graphql'

@InputType()
export class SetMessageAttributesInput {
  messageId!: string

  read?: boolean
  archived?: boolean
  encCategory?: string
}
