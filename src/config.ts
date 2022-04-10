// export const config = {
//   RPC_URL: 'https://rpc.cliffnet.cosmwasm.com',
//   REST_URL: 'https://lcd.cliffnet.cosmwasm.com/',
//   EXPLORER_URL: 'https://block-explorer.cliffnet.cosmwasm.com/',
//   NETWORK_NAME: 'cliffnet-1',
//   NETWORK_TYPE: 'testnet',
//   CHAIN_ID: 'cliffnet-1',
//   CHAIN_NAME: 'cliffnet-1',
//   COIN_DENOM: 'pebble',
//   COIN_MINIMAL_DENOM: 'upebble',
//   COIN_DECIMALS: 6,
//   PREFIX: 'wasm',
//   COIN_TYPE: 118,
//   GAS_PRICE_STEP_LOW: 0.025,
//   GAS_PRICE_STEP_AVERAGE: 0.03,
//   GAS_PRICE_STEP_HIGH: 0.04,
//   FEATURES: ['stargate', 'ibc-transfer', 'no-legacy-stdTx', 'ibc-go'],
// }

// export const chainConfig = {
//   chainId: config.CHAIN_ID,
//   chainName: config.CHAIN_NAME,
//   rpc: config.RPC_URL,
//   rest: config.REST_URL,
//   stakeCurrency: {
//     coinDenom: config.COIN_DENOM,
//     coinMinimalDenom: config.COIN_MINIMAL_DENOM,
//     coinDecimals: config.COIN_DECIMALS,
//     // coinGeckoId: '1',
//   },
//   bip44: {
//     coinType: config.COIN_TYPE,
//   },
//   bech32Config: {
//     bech32PrefixAccAddr: `${config.PREFIX}`,
//     bech32PrefixAccPub: `${config.PREFIX}pub`,
//     bech32PrefixValAddr: `${config.PREFIX}valoper`,
//     bech32PrefixValPub: `${config.PREFIX}valoperpub`,
//     bech32PrefixConsAddr: `${config.PREFIX}valcons`,
//     bech32PrefixConsPub: `${config.PREFIX}valconspub`,
//   },
//   currencies: [
//     {
//       coinDenom: config.COIN_DENOM,
//       coinMinimalDenom: config.COIN_MINIMAL_DENOM,
//       coinDecimals: config.COIN_DECIMALS,
//       // coinGeckoId: '',
//     },
//   ],
//   feeCurrencies: [
//     {
//       coinDenom: config.COIN_DENOM,
//       coinMinimalDenom: config.COIN_MINIMAL_DENOM,
//       coinDecimals: config.COIN_DECIMALS,
//       // coinGeckoId: '',
//     },
//   ],
//   coinType: config.COIN_TYPE,
//   gasPriceStep: {
//     low: config.GAS_PRICE_STEP_LOW,
//     average: config.GAS_PRICE_STEP_AVERAGE,
//     high: config.GAS_PRICE_STEP_HIGH,
//   },
//   features: config.FEATURES,
//   // walletUrlForStaking: config.STAKING_URL,
// }

export const test = () => {}
