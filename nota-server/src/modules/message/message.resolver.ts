import { Args, Mutation, ObjectType, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { PaginatedResponse, PaginationInput } from '../../utils/pagination'
import { Correspondent } from '../correspondent/correspondent.entity'
import { CorrespondentGuard } from '../correspondent/correspondent.guard'
import { GqlAuth, GqlPayload, Viewer } from '../graphql/auth'
import { ApiKey, GqlApiKey } from '../graphql/external'
import { GetMessageInput } from './dtos/message-get.input'
import { MessageSearchInput } from './dtos/message-search.input'
import { MessageSendToExternalInputDTO } from './dtos/message-send-to-external.input'
import { MessageSendInputDTO } from './dtos/message-send.input'
import { MessageSentDTO } from './dtos/message-sent.dto'
import { SetMessageAttributesInput } from './dtos/message-set-attributes.input'
import { Message, MessageAttributes } from './message.entity'
import { MessageService } from './message.service'

@ObjectType()
export class PaginatedMessages extends PaginatedResponse(Message) {}

@Resolver(Message)
export class MessageResolver {
  constructor(
    private readonly messageService: MessageService,
    private readonly correspondentGuard: CorrespondentGuard,
  ) {}

  @ResolveField()
  async correspondent(@Parent() message: Message): Promise<Correspondent> {
    return message.correspondent.load()
  }

  @Mutation(() => MessageSentDTO)
  async correspondentSendMessage(
    @GqlApiKey() apiKey: ApiKey,
    @Args('input') input: MessageSendInputDTO,
  ): Promise<MessageSentDTO> {
    const correspondent = await this.correspondentGuard.validateApiKey(apiKey)
    return this.messageService.sendMessage(correspondent, input)
  }

  @Mutation(() => MessageSentDTO)
  @GqlAuth()
  async sendMessageToExternal(
    @GqlPayload() viewer: Viewer,
    @Args('input') input: MessageSendToExternalInputDTO,
  ): Promise<MessageSentDTO> {
    return this.messageService.sendMessageToExternal(viewer, input)
  }

  @Mutation(() => MessageAttributes)
  @GqlAuth()
  async setMessageAttributes(
    @GqlPayload() viewer: Viewer,
    @Args('input') input: SetMessageAttributesInput,
  ): Promise<MessageAttributes> {
    return this.messageService.setMessageAttributes(viewer, input)
  }

  @Query(() => Message)
  @GqlAuth()
  async getMessage(@GqlPayload() viewer: Viewer, @Args('input') input: GetMessageInput): Promise<Message> {
    return this.messageService.getMessage(viewer, input)
  }

  @Query(() => PaginatedMessages)
  @GqlAuth()
  async searchMessages(
    @GqlPayload() viewer: Viewer,
    @Args('input') input: MessageSearchInput,
    @Args('pagination') pagination: PaginationInput,
  ): Promise<PaginatedMessages> {
    return this.messageService.searchMessages(viewer, input, pagination)
  }
}
