import * as CosmosConnectionProviderType from '@cosmostation/extension-client/cosmos'

export enum CONNECTION_TYPE {
  KEPLR = 'KEPLR',
  COSMOSTATION = 'COSMOSTATION',
  COSMOSTATION_WALLET_CONNECT = 'COSMOSTATION_WALLET_CONNECT',
}

export enum CONNECTED_WITH {
  KEPLR = 'Keplr',
  COSMOSTATION = 'Cosmostation',
}

export type Connection = {
  type: CONNECTION_TYPE
}

export type CosmosConnectionProvider = typeof CosmosConnectionProviderType