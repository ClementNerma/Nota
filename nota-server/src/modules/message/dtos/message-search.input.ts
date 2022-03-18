import { InputType } from '@nestjs/graphql'
import { MessageDirection, NotificationUrgency } from '../message.entity'

@InputType()
export class MessageSearchInput {
  correspondentId?: string
  encSenderName?: string
  encCategory?: string
  direction?: MessageDirection
  fromDate?: Date
  toDate?: Date
  isNotification?: boolean
  notificationUrgency?: NotificationUrgency
}
