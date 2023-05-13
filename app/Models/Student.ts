import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Registration from './Registration'

export default class Student extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public document: string

  @column()
  public email: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Registration, {
    localKey: 'id',
    foreignKey: 'student_id',
    onQuery(query) {
      query.preload('grade')
    }
  })
  public registration: HasMany<typeof Registration>
}
