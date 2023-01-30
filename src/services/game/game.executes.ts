import { DeckService } from '@services/deck'
import { queryCosmonInfo } from '@services/interaction'
import { XPRegistryService } from '@services/xp-registry'
import { useWalletStore } from '@store/walletStore'
import { CosmonType, FightType } from 'types'
import { ArenaType } from 'types/Arena'
import { Deck } from 'types/Deck'
import { calculateFee, GasPrice } from '@cosmjs/stargate'
import { Boost } from 'types/Boost'
import { CosmonTypeWithDecks } from '@containers/arena/components/BuyBoostModal/BuyBoostModalType'
import { computeStatsWithoutBoosts, fillBoosts } from '@utils/boost'
import { computeMalusForCosmons } from '@utils/malus'
import { CosmonTypeWithMalus } from 'types/Malus'

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

    const earnXkiEvent = response.events.find(
      (event) =>
        event.type === 'coin_received' &&
        event.attributes.findIndex((e) => e.key === 'receiver' && e.value === address) !== -1
    )

    const isBot = getAttrValue('bot') === 'true'

    const getOpponentCosmonsList = async () => {
      let myCosmons: CosmonType[] = await Promise.all(
        getAttrValue('opponent_nfts')
          .split(',')
          .map(async (token: string) => {
            const cosmon = await queryCosmonInfo(signingClient, token)
            const stats = await XPRegistryService.queries().getCosmonStats(token)
            const boosts = await XPRegistryService.queries().fecthBoostsForCosmon(token)

            return {
              id: token,
              data: cosmon,
              isInDeck: true,
              isListed: false,
              stats,
              statsWithoutBoosts: computeStatsWithoutBoosts(stats, boosts),
              boosts: fillBoosts(boosts),
            }
          })
      )

      return computeMalusForCosmons(myCosmons)
    }
    const opponentCosmonsList = await getOpponentCosmonsList()
    const cosmonsWithAffinityBonus = [...opponentCosmonsList, ...deck.cosmons].filter(
      (cosmon) => cosmon !== undefined
    ) as CosmonTypeWithMalus[]
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
        isBot: isBot,
        cosmonsWithoutBonus: opponentCosmonsList || [],
        deckScore: isBot
          ? +getAttrValue('bot_power') || 0
          : +getAttrValue('opponent_deck_score') || 0,
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
      earnedXki: earnXkiEvent
        ? earnXkiEvent.attributes.find((attr) => attr.key === 'amount')
        : undefined,
    }

    return battle
  } catch (error) {
    console.error(error)
    throw new Error('Error while executing the fight')
  }
}

/**
 * Buy a boost for a cosmon
 * @param nft_id id of selected cosmon
 * boosts array of boost_name
 */
const buyBoost = async (cosmon: CosmonTypeWithDecks, boost: Boost) => {
  try {
    const { signingClient, address } = useWalletStore.getState()
    if (!signingClient) {
      throw new Error('Signing client unavailable')
    }

    const response = await signingClient.execute(
      address,
      PUBLIC_GAME_CONTRACT,
      {
        buy_boosts: {
          deck_id: cosmon.deckId === -1 ? null : cosmon.deckId,
          nft_id: cosmon.id,
          boosts: [boost.boost_name],
        },
      },
      'auto',
      `[COSMON] buy boost ${boost.boost_name}`,
      (boost.price && [boost.price]) || null
    )

    return response
  } catch (error) {
    console.error(error)
    throw new Error(`Error while buying a boost ${boost.boost_name}`)
  }
}

export default {
  fight,
  registerToArena,
  buyBoost,
}
