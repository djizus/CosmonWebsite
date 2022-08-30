import queries from './game.queries'
import executes from './game.executes'

export class GameService {
  constructor() {}

  static queries() {
    return queries
  }

  static executes() {
    return executes
  }
}
