import { useWalletStore } from '@store/walletStore'
import { DeckId, NFTId } from './deck.types'

const PUBLIC_DECK_CONTRACT = process.env.NEXT_PUBLIC_DECK_CONTRACT!

/**
 * Create a deck with associated NFT ids
 * @param name the name of the deck
 * @param nftIds collection of NFT ids
 */
export const createDeck = async (name: string, nftIds: NFTId[]) => {
  try {
    const { signingClient, address } = useWalletStore.getState()
    const response = await signingClient?.execute(
      address,
      PUBLIC_DECK_CONTRACT,
      { create_deck: { name, nfts: nftIds } },
      'auto',
      'memo'
    )
    return response
  } catch (e) {
    console.error(`Error while creating a deck`, e)
  }
}

/**
 * Create a deck with associated NFT ids
 * @param name the name of the deck
 * @param nftIds collection of NFT ids
 */
export const updateDeck = async (
  deckId: DeckId,
  name: string,
  nftIds: NFTId[]
) => {
  try {
    const { signingClient, address } = useWalletStore.getState()
    const response = await signingClient?.execute(
      address,
      PUBLIC_DECK_CONTRACT,
      { update_deck: { deck: deckId, name, nfts: nftIds } },
      'auto',
      'memo'
    )
    return response
  } catch (e) {
    console.error(`Error while creating a deck`, e)
  }
}

/**
 * Delete the deck from its collection
 * @param deckId the deck id
 */
export const removeDeck = async (deckId: DeckId) => {
  try {
    const { signingClient, address } = useWalletStore.getState()
    const response = await signingClient?.execute(
      address,
      PUBLIC_DECK_CONTRACT,
      { remove_deck: { deck: deckId } },
      'auto',
      'memo'
    )
    return response
  } catch (e) {
    console.error(`Error while removing a deck`, e)
  }
}

/**
 * Remove NFTs from the specified deck
 * @param deckId the deck we want the NFTs to be removed
 * @param nfts the list of the NFTs
 */
export const removeNfts = async (deckId: DeckId, nftIds: DeckId[]) => {
  try {
    const { signingClient, address } = useWalletStore.getState()
    const response = await signingClient?.execute(
      address,
      PUBLIC_DECK_CONTRACT,
      { remove_nfts: { deckId, nfts: nftIds } },
      'auto',
      'memo'
    )
    return response
  } catch (e) {
    console.error(`Error while removing nfts to a deck`, e)
  }
}

/**
 * Add NFTs to the specified deck
 * @param deckId the deck we want the NFTs to be added
 * @param nfts the list of the NFTs
 */
export const addNfts = async (deckId: DeckId, nftIds: NFTId[]) => {
  try {
    const { signingClient, address } = useWalletStore.getState()
    const response = await signingClient?.execute(
      address,
      PUBLIC_DECK_CONTRACT,
      { add_nfts: { deckId, nfts: nftIds } },
      'auto',
      'memo'
    )
    return response
  } catch (e) {
    console.error(`Error while adding nfts to a deck`, e)
  }
}

/**
 * Set a limit of the NFTs we can add to a deck
 * @param maxNfts the limit number
 */
export const setMaxNftInDeck = (maxNfts: number) => {}

/**
 * Set a limit of decks we can add to an account
 * @param maxDeck the limit number
 */
export const setMaxDeckByAddress = (maxDeck: number) => {}

/**
 * @TODO fill the description
 * @param address
 */
export const setNftContractAddress = (address: string) => {}

/**
 * Set the name of a deck
 * @param deckId the id of the deck
 * @param name the name of the deck
 */
export const setName = async (deckId: DeckId, name: string) => {
  try {
    const { signingClient, address } = useWalletStore.getState()
    const response = await signingClient?.execute(
      address,
      PUBLIC_DECK_CONTRACT,
      { set_name: { deckId, name } },
      'auto',
      'memo'
    )
    return response
  } catch (e) {
    console.error(`Error while setting the name of a deck`, e)
  }
}

export default {
  createDeck,
  updateDeck,
  removeDeck,
  removeNfts,
  addNfts,
  setMaxNftInDeck,
  setMaxDeckByAddress,
  setNftContractAddress,
  setName,
}
