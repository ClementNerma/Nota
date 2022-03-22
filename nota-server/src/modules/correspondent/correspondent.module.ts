import { MikroOrmModule } from '@mikro-orm/nestjs'
import { forwardRef, Module } from '@nestjs/common'
import { UserModule } from '../user/user.module'
import { CorrespondenceToken } from './correspondence-token.entity'
import { CorrespondenceTokenResolver } from './correspondence-token.resolver'
import { Correspondent } from './correspondent.entity'
import { CorrespondentGuard } from './correspondent.guard'
import { CorrespondentResolver } from './correspondent.resolver'
import { CorrespondentService } from './correspondent.service'

@Module({
  imports: [MikroOrmModule.forFeature([Correspondent, CorrespondenceToken]), forwardRef(() => UserModule)],
  providers: [CorrespondentService, CorrespondentGuard, CorrespondentResolver, CorrespondenceTokenResolver],
  exports: [CorrespondentGuard],
})
export class CorrespondentModule {}
