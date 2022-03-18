import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcrypt'
import { User } from '../user/user.entity'
import { UserService } from '../user/user.service'

export type JwtPayload = { uuid: string }

export type AuthPayload = JwtPayload

export type AuthValidation = { viewer: User; jwtPayload: JwtPayload }

export type LoginData = { viewer: User; accessToken: string }

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly usersService: UserService) {}

  async validateUser(usernameHash: string, passwordHash: string): Promise<AuthValidation | null> {
    const user = await this.usersService.findByEncryptedUsername(usernameHash)

    if (!user || !(await compare(passwordHash, user.passwordDoubleHash))) {
      return null
    }

    return {
      viewer: user,
      jwtPayload: { uuid: user.uuid },
    }
  }

  async login(encryptedUsername: string, passwordHash: string): Promise<LoginData | null> {
    const maybeUser = await this.validateUser(encryptedUsername, passwordHash)

    return maybeUser
      ? {
          accessToken: this.jwtService.sign(maybeUser.jwtPayload, { expiresIn: '1h' }),
          viewer: maybeUser.viewer,
        }
      : null
  }
}
