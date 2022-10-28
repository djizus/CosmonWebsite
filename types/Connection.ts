export enum CONNECTION_TYPE {
  KEPLR = 'KEPLR',
  COSMOSTATION = 'COSMOSTATION',
}

export type Connection = {
  type: CONNECTION_TYPE
}

export type CosmosConnectionProvider =
  typeof import('/Users/arnaudpolette/klub/cosmon-website/node_modules/@cosmostation/extension-client/cosmos')
