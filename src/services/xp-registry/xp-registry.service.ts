import queries from './xp-registry.queries'
import executes from './xp-registry.executes'

export class XPRegistryService {
  constructor() {}

  static queries() {
    return queries
  }

  static executes() {
    return executes
  }
}
