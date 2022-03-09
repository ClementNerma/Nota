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
import { Field, HideField, InputType, ObjectType } from '@nestjs/graphql'
import { v4 } from 'uuid'
import { User } from '../user/user.entity'

@Embeddable()
@ObjectType()
@InputType('ExchangePermissionsInput')
export class ExchangePermissions {
  @Property()
  @Field()
  canSendMessages!: boolean
}

@Entity()
@ObjectType()
export class Correspondent {
  @PrimaryKey()
  @Field()
  uuid: string = v4()

  @ManyToOne()
  @HideField()
  associatedTo!: IdentifiedReference<User>

  @Property()
  @Unique()
  @HideField()
  apiKey!: string

  @Embedded()
  @Field()
  selfPermissions!: ExchangePermissions

  @Embedded()
  @Field()
  userPermissions!: ExchangePermissions

  @Property()
  @Field()
  userApiKey!: string

  @Property()
  @Field()
  serverUrl!: string

  @Property()
  @Field()
  encDisplayName!: string

  @Property()
  @Field()
  encPublicKey!: string
}
