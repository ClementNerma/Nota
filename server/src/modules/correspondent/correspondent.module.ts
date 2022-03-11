import { MikroOrmModule } from '@mikro-orm/nestjs'
import { forwardRef, Module } from '@nestjs/common'
import { UserModule } from '../user/user.module'
import { Correspondent } from './correspondent.entity'
import { CorrespondentGuard } from './correspondent.guard'
import { CorrespondentResolver } from './correspondent.resolver'
import { CorrespondentService } from './correspondent.service'

@Module({
  imports: [MikroOrmModule.forFeature([Correspondent]), forwardRef(() => UserModule)],
  providers: [CorrespondentService, CorrespondentGuard, CorrespondentResolver],
  exports: [CorrespondentGuard],
})
export class CorrespondentModule {}
