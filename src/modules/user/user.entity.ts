import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core'
import { v4 } from 'uuid'
import { Field, ObjectType } from '@nestjs/graphql'

@Entity()
@ObjectType()
export class User {
  @PrimaryKey()
  @Field()
  uuid: string = v4()

  @Property()
  @Field()
  publicKey!: string

  @Property()
  passwordDoubleSalt!: string

  @Property()
  passwordDoubleHash!: string

  @Property()
  @Unique()
  @Field()
  encUsername!: string

  @Property()
  @Field()
  encPrivateKey!: string

  @Property()
  @Field()
  encPublicName!: string
}
