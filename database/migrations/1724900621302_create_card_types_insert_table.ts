import CardType from '#models/card_type';
import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  async up() {
    await CardType.createMany([
      {
        id: 1,
        name: 'Estória de usuário',
      },
      {
        id: 2,
        name: 'Bug',
      },
      {
        id: 3,
        name: 'Tarefa',
      },
    ]);
  }
}
