import vine from '@vinejs/vine';

export const CreateValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    description: vine.string().trim(),
    startDate: vine.string(),
    endDate: vine.string()
  })
);


