import queries from './arena.queries'
import executes from './arena.executes'

export class ArenaService {
  static contractAddress = String(process.env.NEXT_PUBLIC_TRAINING_CONTRACT)

  constructor() {}

  static queries() {
    return queries
  }

  static executes() {
    return executes
  }
}
