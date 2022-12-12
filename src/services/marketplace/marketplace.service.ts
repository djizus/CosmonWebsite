import queries from './marketplace.queries'
import executes from './marketplace.executes'

export class MarketPlaceService {
  constructor() {}

  static queries() {
    return queries
  }

  static executes() {
    return executes
  }
}
