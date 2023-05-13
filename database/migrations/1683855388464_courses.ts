import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { CourseShifts } from 'Contracts/enum'

export default class extends BaseSchema {
  protected tableName = 'courses'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table.text('description')
      table.enum('shift', Object.values(CourseShifts)).defaultTo(CourseShifts.MAT)
      table.integer('max_vacancy')


      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamps(true, true)
      // table.timestamp('created_at', { useTz: true })
      // table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
