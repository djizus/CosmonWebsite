import deckQueries from './arena.queries'
import deckExecutes from './arena.executes'

export class ArenaService {
  static contractAddress = String(process.env.NEXT_PUBLIC_ARENA_CONTRACT)

  constructor() {}

  static queries() {
    return deckQueries
  }

  static executes() {
    return deckExecutes
  }
}
