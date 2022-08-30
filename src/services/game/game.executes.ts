import { queryCosmonInfo } from '@services/interaction'
import { XPRegistryService } from '@services/xp-registry'
import { useWalletStore } from '@store/walletStore'
import { CosmonType, FightType } from 'types'
import { ArenaType } from 'types/Arena'
import { Deck } from 'types/Deck'

const PUBLIC_GAME_CONTRACT = process.env.NEXT_PUBLIC_GAME_CONTRACT!

/**
 * Register a wallet to an arena
 * @param arena the arena object to register the wallet to
 */
const registerToArena = async (arena: ArenaType) => {
  try {
    const { signingClient, address } = useWalletStore.getState()
    if (!signingClient) {
      throw new Error('Signing client unavailable')
    }
    const response = await signingClient.execute(
      address,
      PUBLIC_GAME_CONTRACT,
      { register_to_arena: { name: arena.name } },
      'auto',
      `[COSMON] register to arena ${arena.name}`,
      (arena.price && [arena.price]) || null
    )

    return response
  } catch (error) {
    console.error(error)
    throw new Error(`Error while registrating to the arena ${arena.name}`)
  }
}

/**
 * Fight against opponent
 * @param deck the deck object
 * @param arena the arena object
 */
const fight = async (deck: Deck, arena: ArenaType): Promise<FightType> => {
  try {
    const { signingClient, address } = useWalletStore.getState()
    if (!signingClient) {
      throw new Error('Signing client unavailable')
    }
    const response = await signingClient.execute(
      address,
      PUBLIC_GAME_CONTRACT,
      { fight: { deck: deck.id, arena: arena.name } },
      'auto',
      `[COSMON] fight against opponent: deck ${deck.id} // ${arena.name}`
    )

    const fightAttributes = response.logs[0].events.find(
      (event) => event.type === 'wasm'
    )?.attributes

    const getAttrValue = (key: string) => {
      return fightAttributes?.find((fa) => fa.key === key)?.value!
    }

    const getOpponentCosmonsList = async () => {
      let myCosmons: CosmonType[] = await Promise.all(
        getAttrValue('opponent_nfts')
          .split(',')
          .map(async (token: string) => {
            const cosmon = await queryCosmonInfo(signingClient, token)
            const stats = await XPRegistryService.queries().getCosmonStats(token)
            return {
              id: token,
              data: cosmon,
              isInDeck: false,
              stats,
            }
          })
      )

      return myCosmons
    }
    const opponentCosmonsList = await getOpponentCosmonsList()

    const cosmonsToUpdate = [...opponentCosmonsList, ...deck.cosmons]
    const cosmonsEmpowered = JSON.parse(getAttrValue('cosmons_bonus'))
    for (const c of cosmonsEmpowered) {
      const defPos = cosmonsToUpdate.findIndex((co) => co.id === c.nft_id)
      cosmonsToUpdate[defPos] = {
        ...cosmonsToUpdate[defPos],
        stats: [
          ...cosmonsToUpdate[defPos]?.stats!.filter((k) => k.key !== 'Hp'),
          { key: 'Hp', value: c.health },
        ],
      }
    }

    const battle: FightType = {
      arena,
      me: {
        identity: getAttrValue('my_address') || '',
        cosmons: [cosmonsToUpdate[3], cosmonsToUpdate[4], cosmonsToUpdate[5]] || [],
      },
      opponent: {
        identity: getAttrValue('opponent') || '',
        cosmons: [cosmonsToUpdate[0], cosmonsToUpdate[1], cosmonsToUpdate[2]] || [],
      },
      winner: {
        identity: getAttrValue('winner') || '',
      },
      events: JSON.parse(getAttrValue('action'))?.results || [],
    }

    return battle
  } catch (error) {
    console.error(error)
    throw new Error('Error while executing the fight')
  }
}

export default {
  fight,
  registerToArena,
}
