import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { v1 as uuidv1 } from 'uuid'

@Entity({ name: 'User' })
export class User {
  @ObjectIdColumn() _id?: string

  @Column() username: string

  @Column() password: string

  @Column() isActive: boolean

  constructor(user) {
    if (user) {
      Object.assign(this, user, { _id: uuidv1(), isActive: true })
    }
  }
}
