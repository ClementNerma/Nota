import { InputType } from '@nestjs/graphql'
import { EncryptedMessageData } from '../message.entity'

@InputType()
export class MessageSendInputDTO {
  encKeyJWK!: string
  encryptedData!: EncryptedMessageData
}
