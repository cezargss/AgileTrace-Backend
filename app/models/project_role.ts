import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import Project from './project.js';
import * as relations from '@adonisjs/lucid/types/relations';

export default class ProjectRole extends BaseModel {
  static readonly table = 'project_roles';

  @belongsTo(() => Project)
  declare project: relations.BelongsTo<typeof Project>;

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare projectId: number;

  @column()
  declare name: string;

  @column()
  declare description: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
