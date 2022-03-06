import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { Correspondent } from '../correspondent/correspondent.entity'
import { CorrespondentGuard } from '../correspondent/correspondent.guard'
import { ApiKey, GqlApiKey } from '../graphql/external'
import { MessageSendInputDTO } from './dtos/message-send.input'
import { MessageSentDTO } from './dtos/message-sent.dto'
import { Message } from './message.entity'
import { MessageService } from './message.service'

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
  async sendMessage(@GqlApiKey() apiKey: ApiKey, @Args('input') input: MessageSendInputDTO): Promise<MessageSentDTO> {
    const correspondent = await this.correspondentGuard.validateApiKey(apiKey)
    return this.messageService.sendMessage(correspondent, input)
  }
}
