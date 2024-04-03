import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import * as relations from '@adonisjs/lucid/types/relations';
import Project from './project.js';
import User from './user.js';
import CardType from './card_type.js';
import CardStatus from './card_status.js';

export default class ProjectActivity extends BaseModel {
  static readonly table = 'project_activities';

  @belongsTo(() => Project)
  declare project: relations.BelongsTo<typeof Project>;

  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'responsibleId'
  })
  declare responsible: relations.BelongsTo<typeof User>;

  @belongsTo(() => CardType)
  declare cardType: relations.BelongsTo<typeof CardType>;

  @belongsTo(() => CardStatus, {
    localKey: 'id',
    foreignKey: 'statusId'
  })
  declare cardStatus: relations.BelongsTo<typeof CardStatus>;

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare projectId: number;

  @column()
  declare cardTypeId: number;

  @column()
  declare responsibleId: number;

  @column()
  declare title: string;

  @column()
  declare description: string;

  @column()
  declare statusId: number;

  @column()
  declare points: number;

  @column()
  declare estimatedDate: Date;

  @column()
  declare developmentDate: Date;

  @column()
  declare testingDate: Date;

  @column()
  declare closedDate: Date;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
