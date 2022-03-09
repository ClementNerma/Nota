import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { ApolloError, ForbiddenError } from 'apollo-server-express'
import { Correspondent } from '../correspondent/correspondent.entity'
import { CorrespondentGuard } from '../correspondent/correspondent.guard'
import { Viewer } from '../graphql/auth'
import { User } from '../user/user.entity'
import { MessageSendToExternalInputDTO } from './dtos/message-send-to-external.input'
import { MessageSendInputDTO } from './dtos/message-send.input'
import { MessageSentDTO } from './dtos/message-sent.dto'
import { Message, MessageAttributes, MessageDirection } from './message.entity'
import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client/core'
import { fetch } from 'cross-fetch'
import { API_KEY_HEADER } from '../graphql/external'
import { paginatedQuery, PaginationInput } from '../../utils/pagination'
import { PaginatedMessages } from './message.resolver'
import { SetMessageAttributesInput } from './dtos/message-set-attributes.input'
import { UserGuard } from '../user/user.guard'
import { mergeObjects } from '../../utils/merge-objects'

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private readonly messageRepo: EntityRepository<Message>,
    private readonly correspondentGuard: CorrespondentGuard,
    private readonly userGuard: UserGuard,
  ) {}

  async sendMessage(from: Correspondent, input: MessageSendInputDTO): Promise<MessageSentDTO> {
    if (!from.selfPermissions.canSendMessages) {
      throw new ForbiddenError("You don't have permission to send messages to this user")
    }

    const message = this.messageRepo.create({
      correspondent: from.uuid,
      direction: MessageDirection.CORRESPONDENT_TO_USER,
      encryptedData: input.encryptedData,
      attributes: {
        read: false,
        archived: false,
        encCategory: input.encryptedData.encCategory,
      },
      createdAt: new Date(),
    })

    await this.messageRepo.persistAndFlush(message)
    return { messageId: message.uuid }
  }

  async sendMessageToExternal(from: Viewer, input: MessageSendToExternalInputDTO): Promise<MessageSentDTO> {
    const correspondent = await this.correspondentGuard.getViewerCorrespondent(from, input.correspondentId)

    if (!correspondent.userPermissions.canSendMessages) {
      throw new ForbiddenError('This correspondent did not allow messages sending from your side')
    }

    const client = new ApolloClient({
      uri: correspondent.serverUrl,
      cache: new InMemoryCache(),
      link: new HttpLink({
        uri: correspondent.serverUrl,
        fetch,
        headers: {
          [API_KEY_HEADER]: correspondent.userApiKey,
        },
      }),
    })

    const res = await client.mutate<{ sendMessage: MessageSentDTO }, { input: MessageSendInputDTO }>({
      mutation: gql`
        mutation ($input: MessageSendInputDTO!) {
          sendMessage(input: $input) {
            messageId
          }
        }
      `,
      variables: {
        input: {
          encryptedData: input.encryptedData,
        },
      },
    })

    if (!res.data) {
      throw new ApolloError('Server responded successfully but without any data')
    }

    return { messageId: res.data.sendMessage.messageId }
  }

  async getMessagesOf(user: User, pagination: PaginationInput): Promise<PaginatedMessages> {
    return paginatedQuery(
      this.messageRepo,
      {
        correspondent: {
          associatedTo: user.uuid,
        },
      },
      pagination,
    )
  }

  async setMessageAttributes(viewer: Viewer, input: SetMessageAttributesInput): Promise<MessageAttributes> {
    const user = await this.userGuard.validateViewer(viewer)

    const message = await this.messageRepo.findOne(input.messageId, { populate: ['correspondent'] })

    if (!message || message.correspondent.unwrap().associatedTo.unwrap().uuid !== user.uuid) {
      throw new ForbiddenError('Provided message ID was not found')
    }

    mergeObjects(message.attributes, input)

    await this.messageRepo.persistAndFlush(message)

    return message.attributes
  }
}
