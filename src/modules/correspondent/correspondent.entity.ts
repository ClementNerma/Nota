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
import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { v4 } from 'uuid'
import { User } from '../user/user.entity'

@Embeddable()
@ObjectType()
@InputType('CorrespondentPermissionsInput')
export class CorrespondentPermissions {
  @Property()
  @Field()
  canSendMessages!: boolean

  @Property()
  @Field()
  canSendNotifications!: boolean
}

@Entity()
@ObjectType()
export class Correspondent {
  @PrimaryKey()
  @Field()
  uuid: string = v4()

  @ManyToOne()
  @Field(() => User)
  associatedTo!: IdentifiedReference<User>

  @Property()
  @Unique()
  apiKey!: string

  @Embedded()
  @Field()
  permissions!: CorrespondentPermissions

  @Property()
  @Field()
  encDisplayName!: string

  @Property()
  @Field()
  encPublicKeyBase64!: string
}
