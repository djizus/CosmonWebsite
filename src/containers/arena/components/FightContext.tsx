import React from 'react'
import { FightType } from 'types'

export type FightContextType = {
  battle: FightType | undefined
  setBattle: (battle: FightType) => void
  battleOverTime: FightType | undefined
  setBattleOverTime: (battle: FightType) => void
  handleCloseFightModal: () => void
  handleCloseFightReportModal: () => void
  handleClickNewFight: () => void
}

export const FightContext = React.createContext<FightContextType>({
  battle: undefined,
  setBattle: (battle: FightType) => {},
  battleOverTime: undefined,
  setBattleOverTime: (battle: FightType) => {},
  handleCloseFightModal: () => {},
  handleCloseFightReportModal: () => {},
  handleClickNewFight: () => {},
})
