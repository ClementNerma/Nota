import { InputType } from '@nestjs/graphql'

@InputType()
export class GetMessageInput {
  messageId!: string
  markAsRead?: boolean
}
