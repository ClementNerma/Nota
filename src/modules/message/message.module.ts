import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { CorrespondentModule } from '../correspondent/correspondent.module'
import { Message } from './message.entity'
import { MessageResolver } from './message.resolver'
import { MessageService } from './message.service'

@Module({
  imports: [MikroOrmModule.forFeature([Message]), CorrespondentModule],
  providers: [MessageService, MessageResolver],
  exports: [MessageService],
})
export class MessageModule {}
