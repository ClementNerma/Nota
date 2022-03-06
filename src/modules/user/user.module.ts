import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { MessageModule } from '../message/message.module'
import { User } from './user.entity'
import { UserGuard } from './user.guard'
import { UserResolver } from './user.resolver'
import { UserService } from './user.service'

@Module({
  imports: [MikroOrmModule.forFeature([User]), MessageModule],
  providers: [UserService, UserGuard, UserResolver],
  exports: [UserService],
})
export class UserModule {}
