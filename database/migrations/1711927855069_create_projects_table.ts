import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'projects';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable();
      table.string('name').notNullable();
      table.string('description').notNullable();
      table.string('start_date').notNullable();
      table.string('end_date').notNullable();
      table.integer('owner_id').notNullable().unsigned();
      table.timestamp('created_at');
      table.timestamp('updated_at');
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
