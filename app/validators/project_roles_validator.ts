import vine from '@vinejs/vine';

export const CreateOrUpdateValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    description: vine.string().trim(),
  })
);
