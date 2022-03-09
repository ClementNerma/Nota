import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { genSalt, hash } from 'bcrypt'
import { PaginationInput } from '../../utils/pagination'
import { Viewer } from '../graphql/auth'
import { Message } from '../message/message.entity'
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

  async findByUuid(uuid: string): Promise<User | null> {
    return this.usersRepo.findOne({ uuid })
  }

  async findByEncryptedUsername(encUsername: string): Promise<User | null> {
    return this.usersRepo.findOne({ encUsername })
  }

  async create(dto: UserCreateDTO): Promise<User> {
    const passwordDoubleSalt = await genSalt()

    const user = this.usersRepo.create({
      passwordDoubleSalt,
      passwordDoubleHash: await hash(dto.passwordHash, passwordDoubleSalt),
      publicKey: dto.publicKey,
      encUsername: dto.encUsername,
      encPublicName: dto.encPublicName,
      encPrivateKey: dto.encPrivateKey,
    })

    await this.usersRepo.persistAndFlush(user)
    return user
  }

  async getMessages(viewer: Viewer, pagination: PaginationInput): Promise<PaginatedMessages> {
    const user = await this.userGuard.validateViewer(viewer)
    return this.messageService.getMessagesOf(user, pagination)
  }
}
