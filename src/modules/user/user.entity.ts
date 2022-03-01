import { Embeddable, Embedded, Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { v4 } from 'uuid'

@Embeddable()
export class EncryptedUser {
  @Property()
  privateKey!: string

  @Property()
  publicName!: string
}

@Entity()
export class User {
  @PrimaryKey()
  uuid = v4()

  @Property()
  publicKey!: string

  @Embedded()
  enc!: EncryptedUser
}
