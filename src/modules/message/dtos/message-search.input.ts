import { InputType } from '@nestjs/graphql'
import { MessageDirection } from '../message.entity'

@InputType()
export class MessageSearchInput {
  encCorrespondentId?: string
  encSenderName?: string
  encCategory?: string
  direction?: MessageDirection
  fromDate?: Date
  toDate?: Date
}
