import ProjectRelease from '#models/project_release';
import ProjectReleaseStatus from '#models/project_release_status';
import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'project_release_status_inserts';

  async up() {
    await ProjectReleaseStatus.createMany([
      {
        id: 1,
        name: 'Produzido',
      },
      {
        id: 2,
        name: 'Em Produção',
      },
      {
        id: 3,
        name: 'Em Desenvolvimento',
      }
    ]);
  }

}
