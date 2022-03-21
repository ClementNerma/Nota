import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { genSalt, hash } from 'bcrypt'
import { PaginationInput } from '../../utils/pagination'
import { Viewer } from '../graphql/auth'
import { PaginatedMessages } from '../message/message.resolver'
import { MessageService } from '../message/message.service'
import { UserCreateDTO } from './dtos/user-create.input'
import { User } from './user.entity'
import { UserGuard } from './user.guard'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: EntityRepository<User>,
    private readonly userGuard: UserGuard,
    private readonly messageService: MessageService,
  ) {}

  async doesUserExist(uuid: string): Promise<boolean> {
    const count = await this.usersRepo.count(uuid)
    return count > 0
  }

  async findByUuid(uuid: string): Promise<User | null> {
    return this.usersRepo.findOne(uuid)
  }

  async findByEncryptedUsername(usernameHash: string): Promise<User | null> {
    return this.usersRepo.findOne({ usernameHash })
  }

  async create(dto: UserCreateDTO): Promise<User> {
    const passwordDoubleSalt = await genSalt()

    const user = this.usersRepo.create({
      usernameHash: dto.usernameHash,
      passwordDoubleSalt,
      passwordDoubleHash: await hash(dto.passwordHash, passwordDoubleSalt),
      publicKeyJWK: dto.publicKeyJWK,
      symKeyEncPrivateKeyJWK: dto.symKeyEncPrivateKeyJWK,
      symKeyEncPrivateKeyIV: dto.symKeyEncPrivateKeyIV,
      encPublicName: dto.encPublicName,
    })

    await this.usersRepo.persistAndFlush(user)
    return user
  }

  async getMessages(viewer: Viewer, pagination: PaginationInput): Promise<PaginatedMessages> {
    const user = await this.userGuard.validateViewer(viewer)
    return this.messageService.getMessagesOf(user, pagination)
  }
}
