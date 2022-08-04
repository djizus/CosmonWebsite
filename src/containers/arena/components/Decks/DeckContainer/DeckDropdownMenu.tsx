import Dropdown from '@components/Dropdown/Dropdown'
import React from 'react'
import DotsVertical from '@public/icons/dots-vertical.svg'

interface DeckDropdownMenuProps {
  onClickDeleteDeck: () => void
}

const DeckDropdownMenu: React.FC<DeckDropdownMenuProps> = ({
  onClickDeleteDeck,
}) => {
  return (
    <Dropdown>
      <Dropdown.Toggler className="ml-[20px]">
        <DotsVertical className="h-[24px] w-[24px]" />
      </Dropdown.Toggler>
      <Dropdown.Menu className="flex flex-col items-start rounded-xl border-[0.5px] border-[#A996FF] border-opacity-50 bg-cosmon-main-secondary">
        <Dropdown.MenuItem onClick={onClickDeleteDeck}>
          <p className="text-sm ">Delete deck</p>
        </Dropdown.MenuItem>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default DeckDropdownMenu
