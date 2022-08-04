import React from 'react'
import DeckSlotsContainer from './DeckSlotsContainer/DeckSlotsContainer'
import DeckBuilderModalCloseButton from './DeckBuilderModalCloseButton'
import DeckBuilderNameSetter from './DeckBuilderNameSetter'
import NFTsList from './NFTsList/NFTsList'

interface DeckBuilderContainerProps {}

const DeckBuilderContainer: React.FC<DeckBuilderContainerProps> = ({}) => {
  return (
    <div className="flex h-full w-full flex-row">
      <div className="h-full basis-1/3">
        <NFTsList />
      </div>
      <div className="h-full basis-2/3 flex-col">
        <div className="flex items-center justify-between">
          <div className="flex flex-1"></div>
          <DeckBuilderNameSetter />
          <DeckBuilderModalCloseButton />
        </div>
        <div className="h-full" style={{ background: '#0f0932' }}>
          <DeckSlotsContainer />
        </div>
      </div>
    </div>
  )
}

export default DeckBuilderContainer
