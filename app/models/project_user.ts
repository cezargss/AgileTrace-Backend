import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import User from './user.js';
import * as relations from '@adonisjs/lucid/types/relations';
import Project from './project.js';
import ProjectRole from './project_role.js';

export default class ProjectUser extends BaseModel {
  static readonly table = 'project_users';

  @belongsTo(() => User)
  declare user: relations.BelongsTo<typeof User>;

  @belongsTo(() => Project)
  declare project: relations.BelongsTo<typeof Project>;

  @belongsTo(() => ProjectRole)
  declare projectRole: relations.BelongsTo<typeof ProjectRole>;

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare projectId: number;

  @column()
  declare projectRoleId: number;

  @column()
  declare userId: number;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
