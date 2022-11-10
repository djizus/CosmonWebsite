import { CosmonType, Deck } from 'types'
import { CosmonTypeWithDecks } from './BuyBoostModalType'

const addBoostAndDeckToCosmon = ({
  cosmons,
  decksList,
}: {
  cosmons: CosmonType[]
  decksList: Deck[]
}): CosmonTypeWithDecks[] => {
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

      return {
        ...c,
        deckId: cosmonDeckNameAndId.deckId,
        deckName: cosmonDeckNameAndId.deckName,
      }
    }

    return {
      ...c,
      deckId: -1,
      deckName: '',
    }
  })
}

export { addBoostAndDeckToCosmon }
