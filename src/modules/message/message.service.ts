import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { Correspondent } from '../correspondent/correspondent.entity'
import { CorrespondentGuard } from '../correspondent/correspondent.guard'
import { Viewer } from '../graphql/auth'
import { User } from '../user/user.entity'
import { MessageSendToExternalInputDTO } from './dtos/message-send-to-external.input'
import { MessageSendInputDTO } from './dtos/message-send.input'
import { MessageSentDTO } from './dtos/message-sent.dto'
import { Message, MessageDirection } from './message.entity'

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private readonly messageRepo: EntityRepository<Message>,
    private readonly correspondentGuard: CorrespondentGuard,
  ) {}

  async sendMessage(from: Correspondent, input: MessageSendInputDTO): Promise<MessageSentDTO> {
    const message = this.messageRepo.create({
      correspondent: from.uuid,
      direction: MessageDirection.CORRESPONDENT_TO_USER,
      encryptedData: input.encryptedData,
      createdAt: new Date(),
    })

    await this.messageRepo.persistAndFlush(message)
    return { messageId: message.uuid }
  }

  async sendMessageToExternal(from: Viewer, input: MessageSendToExternalInputDTO): Promise<MessageSentDTO> {
    const correspondent = await this.correspondentGuard.getViewerCorrespondent(from, input.correspondentId)

    throw new Error('// TODO after design')
  }

  async getMessagesOf(user: User): Promise<Message[]> {
    return this.messageRepo.find({
      correspondent: {
        associatedTo: user.uuid,
      },
    })
  }
}
