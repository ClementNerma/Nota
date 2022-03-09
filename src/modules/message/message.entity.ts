import { Embeddable, Embedded, Entity, IdentifiedReference, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql'
import { v4 } from 'uuid'
import { Correspondent } from '../correspondent/correspondent.entity'

@Embeddable()
@ObjectType()
@InputType('EncryptedMessageDataInput')
export class EncryptedMessageData {
  @Property()
  encSenderName!: string

  @Property()
  encSubject!: string

  @Property({ nullable: true })
  encReplyingToMessageId!: string

  @Property({ nullable: true })
  encCategory!: string

  @Property()
  encContent!: string
}

@Entity()
@ObjectType()
export class Message {
  @PrimaryKey()
  uuid: string = v4()

  @ManyToOne()
  @Field(() => Correspondent)
  correspondent!: IdentifiedReference<Correspondent>

  @Property()
  direction!: MessageDirection

  @Embedded()
  encryptedData!: EncryptedMessageData

  @Property()
  createdAt!: Date
}

export enum MessageDirection {
  USER_TO_CORRESPONDENT = 'USER_TO_CORRESPONDENT',
  CORRESPONDENT_TO_USER = 'CORRESPONDENT_TO_USER',
}

registerEnumType(MessageDirection, {
  name: 'MessageDirection',
})
