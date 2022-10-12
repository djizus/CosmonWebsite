import { DeckService } from '@services/deck'
import { queryCosmonInfo } from '@services/interaction'
import { XPRegistryService } from '@services/xp-registry'
import { useWalletStore } from '@store/walletStore'
import { CosmonType, FightType } from 'types'
import { ArenaType } from 'types/Arena'
import { Deck } from 'types/Deck'
import { calculateFee, GasPrice } from '@cosmjs/stargate'

const PUBLIC_GAME_CONTRACT = process.env.NEXT_PUBLIC_GAME_CONTRACT!
const PUBLIC_STAKING_DENOM = process.env.NEXT_PUBLIC_STAKING_DENOM

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
      { fight: { deck: deck.id, arena: arena.name, nfts: deck.cosmons.map((c) => c.id) } },
      calculateFee(7_500_000, GasPrice.fromString(`0.025${PUBLIC_STAKING_DENOM}`)),
      `[COSMON] fight with deckID ${deck.id} // ${arena.name}`,
      (arena.combat_price && [arena.combat_price]) || null
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
    const cosmonsWithAffinityBonus = [...opponentCosmonsList, ...deck.cosmons]
    const cosmonsEmpowered = JSON.parse(getAttrValue('cosmons_bonus'))
    for (const c of cosmonsEmpowered) {
      const defPos = cosmonsWithAffinityBonus.findIndex((co) => co.id === c.nft_id)
      cosmonsWithAffinityBonus[defPos] = {
        ...cosmonsWithAffinityBonus[defPos],
        stats: [
          ...cosmonsWithAffinityBonus[defPos]?.stats!.filter((k) => k.key !== 'Hp'),
          { key: 'Hp', value: c.health },
        ],
      }
    }

    const battle: FightType = {
      arena,
      opponent: {
        identity: getAttrValue('opponent') || '',
        deckName: await DeckService.queries().getName(+getAttrValue('opponent_deck_id')),
        cosmons:
          [cosmonsWithAffinityBonus[0], cosmonsWithAffinityBonus[1], cosmonsWithAffinityBonus[2]] ||
          [],
        cosmonsWithoutBonus: opponentCosmonsList || [],
        deckScore: +getAttrValue('opponent_deck_score') || 0,
      },
      me: {
        identity: getAttrValue('my_address') || '',
        deckName: deck.name,
        cosmons:
          [cosmonsWithAffinityBonus[3], cosmonsWithAffinityBonus[4], cosmonsWithAffinityBonus[5]] ||
          [],
        cosmonsWithoutBonus: deck.cosmons || [],
        deckScore: +getAttrValue('my_deck_score') || 0,
      },
      winner: {
        identity: getAttrValue('winner') || '', // getAttrValue('winner') === "" if it's a draw
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
