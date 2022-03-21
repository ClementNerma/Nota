import {
  Embeddable,
  Embedded,
  Entity,
  IdentifiedReference,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core'
import { HideField, InputType, ObjectType } from '@nestjs/graphql'
import { v4 } from 'uuid'
import { User } from '../user/user.entity'

@Embeddable()
@ObjectType()
@InputType('ExchangePermissionsInput')
export class ExchangePermissions {
  @Property()
  canSendMessages!: boolean
}

@Entity()
@ObjectType()
export class Correspondent {
  @PrimaryKey()
  uuid: string = v4()

  @ManyToOne()
  @HideField()
  associatedTo!: IdentifiedReference<User>

  @Property()
  @Unique()
  @HideField()
  apiKey!: string

  @Embedded()
  selfPermissions!: ExchangePermissions

  @Embedded()
  userPermissions!: ExchangePermissions

  @Property({ type: 'text' })
  encKeyJWK!: string

  @Property()
  userApiKey!: string

  @Property()
  serverUrl!: string

  @Property()
  encDisplayName!: string
}
