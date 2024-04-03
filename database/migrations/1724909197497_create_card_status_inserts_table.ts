import CardStatus from '#models/card_status';
import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {

  async up() {
    await CardStatus.createMany([
      {
        id: 1,
        name: 'Backlog',
      },
      {
        id: 2,
        name: 'Desenvolvimento',
      },
      {
        id: 3,
        name: 'Testes',
      },
      {
        id: 4,
        name: 'Finalizada',
      },
    ]);
  }
}
