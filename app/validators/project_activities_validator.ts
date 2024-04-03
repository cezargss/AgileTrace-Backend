import { Database } from '@adonisjs/lucid/database';
import vine from '@vinejs/vine';
import { FieldContext } from '@vinejs/vine/types';


export const CreateOrUpdateValidator = vine.compile(
  vine.object({
    title: vine.string().trim(),
    description: vine.string().trim(),
    statusId: vine.number().exists(async (db: Database, value: string, _field: FieldContext) => {
      return await db.from('card_statuses').where('id', value).first();
    }),
    cardTypeId: vine.number().exists(async (db: Database, value: string, _field: FieldContext) => {
      return await db.from('card_types').where('id', value).first();
    }),
    responsibleId: vine.number().exists(async (db: Database, value: string, _field: FieldContext) => {
      return await db.from('users').where('id', value).first();
    }),
    estimatedDate: vine.date({ formats: { utc: true } }).optional(),
    points: vine.number().optional()
  })
);



