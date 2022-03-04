import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { genSalt, hash } from 'bcrypt'
import { UserCreateDTO } from './dtos/user-create.dto'
import { User } from './user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: EntityRepository<User>,
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
}
