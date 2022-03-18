import { InputType } from '@nestjs/graphql'
import { EncryptedMessageData } from '../message.entity'

@InputType()
export class MessageSendToExternalInputDTO {
  correspondentId!: string
  encForMeSymmetricalKeyJWK!: string
  encForThemSymmetricalKeyJWK!: string
  encryptedData!: EncryptedMessageData
}
