import { MikroOrmModule } from '@mikro-orm/nestjs'
import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { AuthModule } from './modules/auth/auth.module'
import { CorrespondentModule } from './modules/correspondent/correspondent.module'
import { MessageModule } from './modules/message/message.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [
    MikroOrmModule.forRoot(),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
    }),
    AuthModule,
    UserModule,
    CorrespondentModule,
    MessageModule,
  ],
})
export class AppModule {}
