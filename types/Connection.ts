import * as CosmosConnectionProviderType from '@cosmostation/extension-client/cosmos'

export enum CONNECTION_TYPE {
  KEPLR = 'KEPLR',
  COSMOSTATION = 'COSMOSTATION',
}

export type Connection = {
  type: CONNECTION_TYPE
}

export type CosmosConnectionProvider = typeof CosmosConnectionProviderType
