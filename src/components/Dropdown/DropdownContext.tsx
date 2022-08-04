import React from 'react'

export const DropdownContext = React.createContext({
  isDropdownOpen: false,
  toggleDropdown: () => {},
})
