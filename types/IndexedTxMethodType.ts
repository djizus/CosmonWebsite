import { IndexedTx } from '@cosmjs/stargate'

export type IndexedTxMethodType =
  | 'new_minted_nft' // Tx of a "cosmon creation" action
  | 'claim_rewards' // Tx of a "claim rewards" action
  | 'claim' // Tx of a "claim airdrop" action
  | 'fight' // Tx of a "fight" action

export type CustomIndexedTx = IndexedTx & { time: string }
