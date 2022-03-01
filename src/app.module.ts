import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [MikroOrmModule.forRoot(), UserModule],
})
export class AppModule {}
