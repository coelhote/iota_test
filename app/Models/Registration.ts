import { DateTime } from 'luxon'
import { BaseModel, HasMany, HasOne, column, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Student from './Student'
import Course from './Course'
import Grade from './Grade'

export default class Registration extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public student_id: number

  @column()
  public course_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Student, {
    foreignKey: 'id',
    localKey: 'student_id'
  })
  public students: HasMany<typeof Student>

  @hasMany(() => Course, {
    foreignKey: 'id',
    localKey: 'course_id'
  })
  public courses: HasMany<typeof Course>

  @hasOne(() => Grade, {
    foreignKey: 'registration_id',
    localKey: 'id'
  })
  public grade: HasOne<typeof Grade>
}
