import { Field, InputType } from '@nestjs/graphql'
import { EncryptedMessageData } from '../message.entity'

@InputType()
export class MessageSendInputDTO {
  @Field()
  encryptedData!: EncryptedMessageData
}
