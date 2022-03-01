import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { CONFIG } from '../../config'
import { UserModule } from '../user/user.module'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => {
        const jwtSecret = CONFIG.JWT_SECRET

        if (typeof jwtSecret !== 'string') {
          throw new Error('JWT secret is not defined or is not a string')
        }

        return {
          signOptions: { expiresIn: CONFIG.JWT_SECRET_EXPIRING.toString() + 's' },
          secret: jwtSecret,
        }
      },
    }),
    UserModule,
  ],
  providers: [AuthResolver, AuthService, JwtStrategy],
  exports: [AuthResolver, AuthService],
})
export class AuthModule {}
