import deckQueries from './xp-registry.queries'
import deckExecutes from './xp-registry.executes'

export class XPRegistryService {
  constructor() {}

  static queries() {
    return deckQueries
  }

  static executes() {
    return deckExecutes
  }
}
