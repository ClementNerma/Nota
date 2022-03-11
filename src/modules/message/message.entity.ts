import { Embeddable, Embedded, Entity, IdentifiedReference, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { Field, HideField, InputType, ObjectType, registerEnumType } from '@nestjs/graphql'
import { v4 } from 'uuid'
import { Correspondent } from '../correspondent/correspondent.entity'
import { User } from '../user/user.entity'

@Embeddable()
@ObjectType()
@InputType('EncryptedNotificationDataInput')
export class EncryptedNotificationData {
  @Property()
  encUrgency!: NotificationUrgency

  @Property()
  encShowUrlOnClick?: string
}

@Embeddable()
@ObjectType()
@InputType('EncryptedMessageDataInput')
export class EncryptedMessageData {
  @Property()
  encSenderName!: string

  @Property()
  encSubject!: string

  @Property({ nullable: true })
  encReplyingToMessageId?: string

  @Property({ nullable: true })
  encCategory?: string

  @Property()
  encContent!: string

  @Embedded()
  encNotificationData?: EncryptedNotificationData
}

@Embeddable()
@ObjectType()
export class MessageAttributes {
  @Property()
  read!: boolean

  @Property()
  archived!: boolean

  @Property({ nullable: true })
  encCategory?: string
}

@Entity()
@ObjectType()
export class Message {
  @PrimaryKey()
  uuid: string = v4()

  @ManyToOne()
  @Field(() => Correspondent)
  correspondent!: IdentifiedReference<Correspondent>

  @ManyToOne()
  @HideField()
  user!: IdentifiedReference<User>

  @Property()
  direction!: MessageDirection

  @Embedded()
  encryptedData!: EncryptedMessageData

  @Embedded()
  attributes!: MessageAttributes

  @Property()
  receivedAt!: Date

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

export enum NotificationUrgency {
  DO_NOT_DISTURB = 'DO_NOT_DISTURB',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

registerEnumType(NotificationUrgency, {
  name: 'NotificationUrgency',
})
