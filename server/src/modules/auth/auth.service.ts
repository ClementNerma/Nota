import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcrypt'
import { UserService } from '../user/user.service'

export type JwtPayload = { uuid: string }

export type AuthPayload = JwtPayload

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly usersService: UserService) {}

  async validateUser(usernameHash: string, passwordHash: string): Promise<JwtPayload | null> {
    const user = await this.usersService.findByEncryptedUsername(usernameHash)

    if (!user || !(await compare(passwordHash, user.passwordDoubleHash))) {
      return null
    }

    return { uuid: user.uuid }
  }

  async login(encryptedUsername: string, passwordHash: string): Promise<string | null> {
    const maybeUser = await this.validateUser(encryptedUsername, passwordHash)

    return maybeUser ? this.jwtService.sign(maybeUser, { expiresIn: '1h' }) : null
  }
}
