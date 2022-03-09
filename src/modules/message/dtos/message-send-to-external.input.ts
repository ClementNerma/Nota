import { Field, InputType } from '@nestjs/graphql'
import { EncryptedMessageData } from '../message.entity'

@InputType()
export class MessageSendToExternalInputDTO {
  @Field()
  correspondentId!: string

  @Field()
  encryptedData!: EncryptedMessageData
}
