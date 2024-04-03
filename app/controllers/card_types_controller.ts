// import type { HttpContext } from '@adonisjs/core/http'

import CardType from "#models/card_type";

export default class CardTypesController {
  async index() {
    return await CardType.all();
  }
}
