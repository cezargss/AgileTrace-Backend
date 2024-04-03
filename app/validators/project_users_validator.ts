import { Database } from '@adonisjs/lucid/database';
import vine from '@vinejs/vine';
import { FieldContext } from '@vinejs/vine/types';

export const CreateValidator = vine.compile(
  vine.object({
    userId: vine.number().exists(async (db: Database, value: string, _field: FieldContext) => {
      return await db.from('projects').where('id', value).first();
    })
  })
);

export const InviteUserValidator = vine.compile(
  vine.object({
    email: vine.string().trim(),
    name: vine.string().trim(),
    projectRoleId: vine.number()
  })
);

export const UpdateValidator = vine.compile(
  vine.object({
    projectRoleId: vine.number()
  })
);

