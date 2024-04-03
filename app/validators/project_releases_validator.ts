import { Database } from '@adonisjs/lucid/database';
import vine from '@vinejs/vine';
import { FieldContext } from '@vinejs/vine/types';

export const CreateOrUpdateValidator = vine.compile(
  vine.object({
    version: vine.string().trim(),
    description: vine.string().trim(),
    releaseDate: vine.date({ formats: { utc: true } }),
    projectReleaseStatusId: vine.number().exists(async (db: Database, value: string, _field: FieldContext) => {
      return await db.from('project_release_statuses').where('id', value).first();
    }),
  })
);
