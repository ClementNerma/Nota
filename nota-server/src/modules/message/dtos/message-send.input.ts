import { InputType } from '@nestjs/graphql'
import { EncryptedMessageData } from '../message.entity'

@InputType()
export class MessageSendInputDTO {
  encForMeSymmetricalKeyJWK!: string
  encForThemSymmetricalKeyJWK!: string
  encryptedData!: EncryptedMessageData
}
