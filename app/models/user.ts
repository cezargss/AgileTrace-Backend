import { DateTime } from 'luxon';
import { withAuthFinder } from '@adonisjs/auth';
import hash from '@adonisjs/core/services/hash';
import { compose } from '@adonisjs/core/helpers';
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm';
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens';
import Project from './project.js';
import * as relations from '@adonisjs/lucid/types/relations';

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
});

export default class User extends compose(BaseModel, AuthFinder) {
  static readonly table = 'users';

  @manyToMany(() => Project, {
    localKey: 'id',
    pivotForeignKey: 'userId',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'projectId',
  })
  declare projects: relations.ManyToMany<typeof Project>;

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare name: string | null;

  @column()
  declare email: string;

  @column()
  declare password: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null;

  static readonly accessTokens = DbAccessTokensProvider.forModel(User);
}
