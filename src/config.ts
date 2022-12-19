export const chainInfo = {
  chainId: process.env.NEXT_PUBLIC_CHAIN_ID || 'kichain-2',
  chainName: process.env.NEXT_PUBLIC_CHAIN_NAME || 'Ki',
  rpc: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT || 'https://rpc-mainnet.blockchain.ki/',
  rest: process.env.NEXT_PUBLIC_CHAIN_REST_ENDPOINT || 'https://api-mainnet.blockchain.ki/',
  bip44: {
    coinType:
      (process.env.NEXT_PUBLIC_BIP_COIN_TYPE && +process.env.NEXT_PUBLIC_BIP_COIN_TYPE) || 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: process.env.NEXT_PUBLIC_CHAIN_BECH32_PREFIX || 'ki',
    bech32PrefixAccPub: process.env.NEXT_PUBLIC_CHAIN_BECH32_PREFIX + 'pub',
    bech32PrefixValAddr: process.env.NEXT_PUBLIC_CHAIN_BECH32_PREFIX + 'valoper',
    bech32PrefixValPub: process.env.NEXT_PUBLIC_CHAIN_BECH32_PREFIX + 'valoperpub',
    bech32PrefixConsAddr: process.env.NEXT_PUBLIC_CHAIN_BECH32_PREFIX + 'valcons',
    bech32PrefixConsPub: process.env.NEXT_PUBLIC_CHAIN_BECH32_PREFIX + 'valconspub',
  },
  currencies: [
    {
      coinDenom: process.env.NEXT_PUBLIC_DENOM || 'KI',
      coinMinimalDenom: process.env.NEXT_PUBLIC_STAKING_DENOM || 'uxki',
      coinDecimals: 6,
      coinGeckoId: process.env.NEXT_PUBLIC_CHAIN_GECKO_ID || 'ki',
    },
  ],
  feeCurrencies: [
    {
      coinDenom: process.env.NEXT_PUBLIC_DENOM || 'KI',
      coinMinimalDenom: process.env.NEXT_PUBLIC_STAKING_DENOM || 'uxki',
      coinDecimals: 6,
      coinGeckoId: 'ki',
    },
  ],
  stakeCurrency: {
    coinDenom: process.env.NEXT_PUBLIC_DENOM || 'KI',
    coinMinimalDenom: process.env.NEXT_PUBLIC_STAKING_DENOM || 'uxki',
    coinDecimals: 6,
    coinGeckoId: process.env.NEXT_PUBLIC_CHAIN_GECKO_ID || 'ki',
  },
  coinType: 118,
  gasPriceStep: {
    low: 0.025,
    average: 0.25,
    high: 0.3,
  },
  features: ['cosmwasm', 'ibc-transfer', 'ibc-go', 'wasmd_0.24+'],
}

export const ibcTestnetChainInfo = {
  rpc: 'https://rpc-test.osmosis.zone/',
  rest: 'https://lcd-test.osmosis.zone/',
  chainId: 'osmo-test-4',
  chainName: 'Osmosis Testnet',
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: 'osmo',
  },
  currencies: [
    {
      coinDenom: 'OSMO',
      coinMinimalDenom: 'uosmo',
      coinDecimals: 6,
      coinGeckoId: 'osmosis',
      coinImageUrl: '/tokens/osmo.svg',
      isStakeCurrency: true,
      isFeeCurrency: true,
    },
    {
      coinDenom: 'ION',
      coinMinimalDenom: 'uion',
      coinDecimals: 6,
      coinGeckoId: 'ion',
      coinImageUrl: '/tokens/ion.png',
    },
  ],
  gasPriceStep: {
    low: 0,
    average: 0,
    high: 0.025,
  },
  features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx', 'ibc-go'],
  explorerUrlToTx: 'https://testnet.mintscan.io/osmosis-testnet/txs/{txHash}',
}
