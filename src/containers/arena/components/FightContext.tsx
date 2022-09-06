import React from 'react'
import { FightType } from 'types'

export type FightContextType = {
  battle: FightType | undefined
  setBattle: (battle: FightType) => void
  battleOverTime: FightType | undefined
  setBattleOverTime: React.Dispatch<React.SetStateAction<FightType | undefined>>
  handleCloseFightModal: () => void
  handleCloseFightReportModal: () => void
  handleClickNewFight: () => void
}

export const FightContext = React.createContext<FightContextType>({} as any)
