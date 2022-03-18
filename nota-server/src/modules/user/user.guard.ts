import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { ForbiddenError } from 'apollo-server-express'
import { ViewerMaybe } from '../graphql/auth'
import { User } from './user.entity'

@Injectable()
export class UserGuard {
  constructor(@InjectRepository(User) private readonly userRepo: EntityRepository<User>) {}

  async validateViewer(viewer: ViewerMaybe): Promise<User> {
    if (!viewer) {
      throw new ForbiddenError('You must be logged in to perform this action')
    }

    const user = await this.userRepo.findOne({ uuid: viewer.uuid })

    if (!user) {
      throw new ForbiddenError('Viewer not found in database')
    }

    return user
  }
}
