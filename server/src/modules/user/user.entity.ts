import { Collection, Entity, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core'
import { v4 } from 'uuid'
import { Field, HideField, ObjectType } from '@nestjs/graphql'
import { Correspondent } from '../correspondent/correspondent.entity'

@Entity()
@ObjectType()
export class User {
  @PrimaryKey()
  uuid: string = v4()

  @Property()
  @Unique()
  usernameHash!: string

  @Property()
  @HideField()
  passwordDoubleSalt!: string

  @Property()
  @HideField()
  passwordDoubleHash!: string

  @Property()
  symKeyEncPrivateKey!: string

  @Property()
  publicKey!: string

  @Property()
  encPublicName!: string

  @Field(() => [Correspondent])
  @OneToMany(() => Correspondent, (c) => c.associatedTo)
  correspondents = new Collection<Correspondent>(this)
}
