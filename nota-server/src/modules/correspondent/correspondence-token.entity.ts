import { HideField, ObjectType } from '@nestjs/graphql'
import { Entity, IdentifiedReference, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core'
import { v4 } from 'uuid'
import { User } from '../user/user.entity'

@Entity()
@ObjectType()
export class CorrespondenceToken {
  @PrimaryKey()
  uuid: string = v4()

  @Property()
  @Unique()
  token!: string

  @HideField()
  @ManyToOne(() => User)
  associatedTo!: IdentifiedReference<User>

  @Property()
  expiresAt!: Date

  @Property()
  createdAt!: Date
}
