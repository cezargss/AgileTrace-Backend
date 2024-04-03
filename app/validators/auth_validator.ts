import vine from '@vinejs/vine';
import { Database } from '@adonisjs/lucid/database';
import { FieldContext } from '@vinejs/vine/types';

export const AuthSignInValidator = vine.compile(
  vine.object({
    email: vine.string().trim(),
    password: vine.string().trim().minLength(6),
  })
);

export const AuthSignUpValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    email: vine.string().unique(async (db: Database, value: string, _field: FieldContext) => {
      const user = await db.from('users').where('email', value).first();
      return !user;
    }),
    password: vine.string().trim().minLength(6)
  })
);

export const SendRedefineValidator = vine.compile(
  vine.object({
    email: vine.string().trim()
  })
);


export const ValidateTokenValidator = vine.compile(
  vine.object({
    token: vine.string().trim()
  })
);

export const RedefinePasswordValidator = vine.compile(
  vine.object({
    password: vine.string().trim()
  })
);


