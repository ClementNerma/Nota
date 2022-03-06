import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { Correspondent } from './correspondent.entity'
import { CorrespondentGuard } from './correspondent.guard'
import { CorrespondentResolver } from './correspondent.resolver'
import { CorrespondentService } from './correspondent.service'

@Module({
  imports: [MikroOrmModule.forFeature([Correspondent])],
  providers: [CorrespondentService, CorrespondentGuard, CorrespondentResolver],
  exports: [CorrespondentGuard],
})
export class CorrespondentModule {}
