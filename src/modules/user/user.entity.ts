import { Collection, Entity, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core'
import { v4 } from 'uuid'
import { Field, ObjectType } from '@nestjs/graphql'
import { Correspondent } from '../correspondent/correspondent.entity'

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

  @Field(() => [Correspondent])
  @OneToMany(() => Correspondent, (c) => c.associatedTo)
  correspondents = new Collection<Correspondent>(this)
}
