import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'project_activities';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable();
      table.integer('project_id');
      table.integer('responsible_id');
      table.integer('card_type_id').notNullable();
      table.integer('status_id').notNullable();
      table.integer('points').notNullable();
      table.string('title').notNullable();
      table.string('description').notNullable();
      table.date("estimated_date").nullable();
      table.date("development_date").nullable();
      table.date("testing_date").nullable();
      table.date("closed_date").nullable();
      table.timestamp('created_at');
      table.timestamp('updated_at');
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
