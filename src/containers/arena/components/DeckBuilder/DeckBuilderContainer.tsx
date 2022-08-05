import React from 'react'
import DeckSlotsContainer from './DeckSlotsContainer/DeckSlotsContainer'
import DeckBuilderModalCloseButton from './DeckBuilderModalCloseButton'
import DeckBuilderNameSetter from './DeckBuilderNameSetter'
import NFTsList from './NFTsList/NFTsList'

interface DeckBuilderContainerProps {}

const DeckBuilderContainer: React.FC<DeckBuilderContainerProps> = ({}) => {
  return (
    <div
      className="flex h-full w-full flex-row"
      style={{
        backgroundImage: 'url("/bg-deck-builder.png")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
      }}
    >
      <div className="h-full basis-1/3 " style={{ background: '#f6f6fc' }}>
        <NFTsList />
      </div>
      <div className="h-full basis-2/3 flex-col">
        <div
          className="flex items-center justify-between"
          style={{ background: '#f6f6fc' }}
        >
          <div className="flex flex-1"></div>
          <DeckBuilderNameSetter />
          <DeckBuilderModalCloseButton />
        </div>
        <div className="h-full">
          <DeckSlotsContainer />
        </div>
      </div>
    </div>
  )
}

export default DeckBuilderContainer
