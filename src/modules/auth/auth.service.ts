import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcrypt'
import { UserService } from '../user/user.service'

export type JwtPayload = { uuid: string }

export type AuthPayload = JwtPayload

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly usersService: UserService) {}

  async validateUser(uuid: string, plainPassword: string): Promise<JwtPayload | null> {
    const user = await this.usersService.findByUuid(uuid)

    if (!user || !(await compare(plainPassword, user.passwordHash))) {
      return null
    }

    return { uuid: user.uuid }
  }

  async login(uuid: string, plainPassword: string): Promise<string | null> {
    const maybeUser = await this.validateUser(uuid, plainPassword)

    return maybeUser ? this.jwtService.sign(maybeUser, { expiresIn: '1h' }) : null
  }
}
