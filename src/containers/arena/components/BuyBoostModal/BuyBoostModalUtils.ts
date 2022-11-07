import { CosmonType, Deck } from 'types'
import { Boost, BoostForCosmon } from 'types/Boost'
import { CosmonTypeWithDecksAndBoosts } from './BuyBoostModalType'

const addBoostAndDeckToCosmon = ({
  cosmons,
  decksList,
  boostsForCosmons,
}: {
  cosmons: CosmonType[]
  decksList: Deck[]
  boostsForCosmons: BoostForCosmon[]
}): CosmonTypeWithDecksAndBoosts[] => {
  return cosmons.map((c) => {
    if (c.isInDeck) {
      const cosmonDeckNameAndId = decksList.reduce(
        (
          acc: {
            deckName: string
            deckId: number
          },
          curr
        ) => {
          const isCosmonInThisDeckIndex = curr.cosmons.findIndex((cosmon) => cosmon.id === c.id)

          if (isCosmonInThisDeckIndex !== -1) {
            return {
              deckName: curr.name,
              deckId: curr.id,
            }
          }

          return acc
        },
        {
          deckName: '',
          deckId: -1,
        }
      )

      const cosmonWithBoost = boostsForCosmons.find(
        (boostsForCosmon) => boostsForCosmon.id === c.id
      )?.boosts

      if (cosmonWithBoost) {
        return {
          ...c,
          deckId: cosmonDeckNameAndId.deckId,
          deckName: cosmonDeckNameAndId.deckName,
          boosts: cosmonWithBoost as [Boost | null, Boost | null, Boost | null],
        }
      }

      return {
        ...c,
        deckId: cosmonDeckNameAndId.deckId,
        deckName: cosmonDeckNameAndId.deckName,
        boosts: [null, null, null],
      }
    }

    return {
      ...c,
      deckId: -1,
      deckName: '',
      boosts: [null, null, null],
    }
  })
}

export { addBoostAndDeckToCosmon }
