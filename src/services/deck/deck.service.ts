import deckQueries from './deck.queries'
import deckExecutes from './deck.executes'

export class DeckService {
  constructor() {}

  static queries() {
    return deckQueries
  }

  static executes() {
    return deckExecutes
  }
}
