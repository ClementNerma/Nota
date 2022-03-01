import { Embeddable, Embedded, Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { v4 } from 'uuid'
import { Field, ObjectType } from '@nestjs/graphql'

@Embeddable()
@ObjectType()
export class EncryptedUser {
  @Property()
  privateKey!: string

  @Property()
  publicName!: string
}

@Entity()
@ObjectType()
export class User {
  @PrimaryKey()
  @Field()
  uuid: string = v4()

  @Property()
  @Field()
  publicKey!: string

  @Embedded()
  @Field()
  enc!: EncryptedUser

  @Property()
  passwordHash!: string
}
