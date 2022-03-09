import { MikroOrmModule } from '@mikro-orm/nestjs'
import { forwardRef, Module } from '@nestjs/common'
import { CorrespondentModule } from '../correspondent/correspondent.module'
import { UserModule } from '../user/user.module'
import { Message } from './message.entity'
import { MessageResolver } from './message.resolver'
import { MessageService } from './message.service'

@Module({
  imports: [MikroOrmModule.forFeature([Message]), CorrespondentModule, forwardRef(() => UserModule)],
  providers: [MessageService, MessageResolver],
  exports: [MessageService],
})
export class MessageModule {}
