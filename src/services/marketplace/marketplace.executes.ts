import { Coin } from '@cosmjs/proto-signing'
import { useWalletStore } from '@store/walletStore'

const PUBLIC_MARKETPLACE_CONTRACT = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT!
/**
 * List a nft
 * @param nftId id of the nft
 * @param price coin of the nft
 */
export const listNft = async (nftId: string, price: Coin) => {
  try {
    const { signingClient, address } = useWalletStore.getState()
    const response = await signingClient?.executeMultiple(
      address,
      [
        {
          contractAddress: process.env.NEXT_PUBLIC_NFT_CONTRACT || '',
          msg: {
            approve: {
              spender: PUBLIC_MARKETPLACE_CONTRACT,
              token_id: nftId,
            },
          },
        },
        {
          contractAddress: PUBLIC_MARKETPLACE_CONTRACT,
          msg: {
            list_nft: {
              nft_id: nftId,
              price: price,
            },
          },
        },
      ],
      'auto',
      '[COSMON] list a nft'
    )

    return response
  } catch (e: any) {
    console.error(e)
    throw new Error(`Error while listing a nft`)
  }
}

/**
 * Unlist a nft
 * @param nftId id of the nft
 */
export const unlistNft = async (nftId: string, price: number) => {
  try {
    const { signingClient, address } = useWalletStore.getState()
    const response = await signingClient?.execute(
      address,
      PUBLIC_MARKETPLACE_CONTRACT,
      {
        unlist_nft: {
          nft_id: nftId,
          price,
        },
      },
      'auto',
      '[COSMON] unlist nft'
    )

    return response
  } catch (e: any) {
    console.error(e)
    throw new Error(`Error while unlisting nft`)
  }
}

/**
 * Buy a nft
 * @param nftId id of the nft
 */
export const buyNft = async (nftId: string, price: Coin) => {
  try {
    const { signingClient, address } = useWalletStore.getState()
    const response = await signingClient?.execute(
      address,
      PUBLIC_MARKETPLACE_CONTRACT,
      {
        buy_nft: {
          nft_id: nftId,
          price: price.amount,
        },
      },
      'auto',
      '[COSMON] buy nft',
      price ? [price] : []
    )

    return response
  } catch (e: any) {
    console.error(e)
    throw new Error(`Error while buying nft`)
  }
}

export default {
  listNft,
  unlistNft,
  buyNft,
}
