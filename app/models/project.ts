import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import ProjectUser from './project_user.js';
import * as relations from '@adonisjs/lucid/types/relations';
import User from './user.js';
import ProjectActivity from './project_activity.js';

export default class Project extends BaseModel {
  static readonly table = 'projects';

  @belongsTo(() => User)
  declare user: relations.BelongsTo<typeof User>;

  @hasMany(() => ProjectUser, {
    foreignKey: 'projectId',
  })
  declare project_users: relations.HasMany<typeof ProjectUser>;

  @hasMany(() => ProjectActivity, {
    foreignKey: 'projectId',
  })
  declare project_activities: relations.HasMany<typeof ProjectActivity>;

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare name: string;

  @column()
  declare description: string;

  @column()
  declare ownerId: number;

  @column()
  declare startDate: string;

  @column()
  declare endDate: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
