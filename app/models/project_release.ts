import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import ProjectReleaseStatus from './project_release_status.js';
import * as relations from '@adonisjs/lucid/types/relations';
import Project from './project.js';

export default class ProjectRelease extends BaseModel {
  static readonly table = 'project_releases';

  @belongsTo(() => Project)
  declare project: relations.BelongsTo<typeof Project>;

  @belongsTo(() => ProjectReleaseStatus)
  declare projectReleaseStatus: relations.BelongsTo<typeof ProjectReleaseStatus>;

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare projectId: number;

  @column()
  declare projectReleaseStatusId: number;

  @column()
  declare version: string;

  @column()
  declare releaseDate: Date;

  @column()
  declare description: string | null;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
