import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Registration from './Registration'

export default class Grade extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public registration_id: number

  @column()
  public grade: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Registration, {
    localKey: 'registration_id',
    foreignKey: 'id',
    onQuery(query) {
      query.preload('students')
    }
  })
  public registration: HasMany<typeof Registration>

}
