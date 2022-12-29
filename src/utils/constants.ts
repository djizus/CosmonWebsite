const EMAIL_COLLECTED_LOCAL_STORAGE_KEY = 'email-collected'
const EMAIL_LATER_COUNT_LOCAL_STORAGE_KEY = 'email-later-count'
const IS_MARKETPLACE_ACTIVE: boolean =
  process.env.NEXT_PUBLIC_IS_ACTIVE_MARKETPLACE !== '0' ?? false

const MINT_SCAN_BLOCK_URL = 'https://www.mintscan.io/ki-chain/blocks/'

export {
  EMAIL_COLLECTED_LOCAL_STORAGE_KEY,
  EMAIL_LATER_COUNT_LOCAL_STORAGE_KEY,
  IS_MARKETPLACE_ACTIVE,
  MINT_SCAN_BLOCK_URL,
}
