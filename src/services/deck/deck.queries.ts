import { useWalletStore } from '../../store/walletStore'
import { DeckId, NFTId } from 'types'

const PUBLIC_DECK_CONTRACT = process.env.NEXT_PUBLIC_DECK_CONTRACT!

/**
 * Check if the deck is valid
 * @param deckId the id of the deck
 */
export const isDeckValid = async (deckId: DeckId) => {
  try {
    const { signingClient } = useWalletStore.getState()
    const isDeckValid = await signingClient?.queryContractSmart(
      PUBLIC_DECK_CONTRACT,
      { is_valid: { deck: deckId } }
    )
    return isDeckValid
  } catch (e) {
    console.error(`Error while checking if deck ${deckId} was valid`, e)
  }
}

/**
 * Get the deck by its address
 * @param address the address of the deck
 */
export const getDecksByAddr = async (address: string) => {
  try {
    const { signingClient } = useWalletStore.getState()
    const decksList = await signingClient?.queryContractSmart(
      PUBLIC_DECK_CONTRACT,
      { get_decks_by_addr: { address } }
    )
    return decksList
  } catch (e) {
    console.error(`Error while fetching decks owned by ${address}`, e)
  }
}

/**
 * Get the NFTs that compose a deck
 * @param deckId the id of the deck
 */
export const getNftsByDeckId = async (deckId: DeckId) => {
  try {
    const { signingClient } = useWalletStore.getState()
    const nftsList = await signingClient?.queryContractSmart(
      PUBLIC_DECK_CONTRACT,
      { get_nfts_by_deck_id: { deck: deckId } }
    )
    return nftsList
  } catch (e) {
    console.error(`Error while fetching nfts if the deck ${deckId}`, e)
  }
}

/**
 * Get the limit of NFTs we can add in a deck
 */
export const getMaxNftInDeck = () => {}

/**
 * Get the limit of deck we can create by account
 */
export const getMaxDeckByAddress = () => {}

/**
 * Check if an NFT is already in a deck
 * @param nftId
 */
export const isNftInADeck = async (nftId: NFTId) => {
  try {
    const { signingClient } = useWalletStore.getState()
    const response = await signingClient?.queryContractSmart(
      PUBLIC_DECK_CONTRACT,
      { is_nft_in_a_deck: { nft: nftId } }
    )
    return response
  } catch (e) {
    console.error(`Error while cheking if an nft is already in a deck`, e)
  }
}

/**
 * Check if an NFTs collection is already in a deck
 * @param nftIds Collection of
 */
export const isNftsInADeck = async (nftIds: NFTId[]) => {
  try {
    const { signingClient } = useWalletStore.getState()
    const response = await signingClient?.queryContractSmart(
      PUBLIC_DECK_CONTRACT,
      { is_nfts_in_a_deck: { nft: nftIds } }
    )
    return response
  } catch (e) {
    console.error(
      `Error while cheking if several nfts are in already in deck`,
      e
    )
  }
}

/**
 * @TODO fill the description (dont know ATM)
 */
export const getNftContractAddress = () => {}

/**
 * Get the name of a deck
 * @param deckId the id of the deck
 */
export const getName = async (deckId: DeckId) => {
  try {
    const { signingClient } = useWalletStore.getState()
    const response = await signingClient?.queryContractSmart(
      PUBLIC_DECK_CONTRACT,
      { get_name: { deck: deckId } }
    )
    return response
  } catch (e) {
    console.error(
      `Error while cheking if several nfts are in already in deck`,
      e
    )
  }
}

/**
 * Get affinity of a NFT type
 * @param cosmonType
 */
export const getAffinity = (cosmonType: string) => {}

/**
 * Get cosmons affinities
 */
export const getPersonalityAffinities = async () => {
  try {
    const { signingClient } = useWalletStore.getState()
    const response = await signingClient?.queryContractSmart(
      PUBLIC_DECK_CONTRACT,
      { get_affinities: {} }
    )
    return response
  } catch (e) {
    console.error(`Error while getting cosmons affinities`, e)
  }
}

export default {
  isDeckValid,
  getDecksByAddr,
  getNftsByDeckId,
  getMaxNftInDeck,
  getMaxDeckByAddress,
  isNftInADeck,
  isNftsInADeck,
  getNftContractAddress,
  getName,
  getAffinity,
  getPersonalityAffinities,
}
