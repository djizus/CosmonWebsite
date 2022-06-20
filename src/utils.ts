import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'
import { GasPrice } from '@cosmjs/stargate'
import { FaucetClient } from '@cosmjs/faucet-client'

// import { chainConfig, config } from './config'

// export const hasKeplr = () => {
//   return window.getOfflineSigner && window.keplr
// }

// export const connectKeplr = async () => {
//   if (hasKeplr()) {
//     if (window.keplr.experimentalSuggestChain) {
//       try {
//         await window.keplr.experimentalSuggestChain(chainConfig)
//         await window.keplr.enable(chainConfig.chainId)
//         // const offlineSigner = window.getOfflineSigner(chainConfig.chainId)
//         // const accounts = await offlineSigner.getAccounts()
//         // console.log('current address', accounts[0].address)

//         // // localStorage.setItem('connect', 'TRUE')
//         // const balance = await getBalance(accounts[0].address)
//         // console.log('balance', balance)
//         // // return {
//         // //   address: accounts[0].address,
//         // //   balance: balance,
//         // // }
//       } catch (e) {
//         console.log('error', e)
//         alert('Failed to suggest the chain')
//       }
//     }
//   } else {
//     alert('You need to have a keplr wallet installed')
//   }
// }

// // export async function getBalance(address: string) {
// //   try {
// //     const response = await fetch(`${config.REST_URL}/bank/balances/${address}`)

// //     const json = await response.json()
// //     console.log('response', json)
// //     const balance = json.result.map((token: any) => {
// //       console.log('token', token)
// //       if (token.denom === config.COIN_DENOM) {
// //         return Math.floor(token.amount) / 1000000
// //       }
// //     })
// //     return balance[0]
// //   } catch {
// //     alert('error while fetching balance.')
// //   }
// // }

// export async function getClient() {
//   // const secp256 = await DirectSecp256k1HdWallet.generate(24, {
//   //   prefix: 'wasm',
//   // })
//   const offlineSigner = window.getOfflineSigner(chainConfig.chainId)
//   const accounts = await offlineSigner.getAccounts()
//   const client = await SigningCosmWasmClient.connectWithSigner(
//     'https://rpc.cliffnet.cosmwasm.com',
//     accounts[0],
//     {
//       prefix: 'wasm',
//       gasPrice: GasPrice.fromString('0.025upebble'),
//     }
//   )
//   // console.log(
//   //   'balance before faucet',
//   //   await client.getBalance(accounts[0], config.COIN_DENOM)
//   // )
// }
