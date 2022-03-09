import { InputType } from '@nestjs/graphql'
import { EncryptedMessageData } from '../message.entity'

@InputType()
export class MessageSendInputDTO {
  encryptedData!: EncryptedMessageData
}
