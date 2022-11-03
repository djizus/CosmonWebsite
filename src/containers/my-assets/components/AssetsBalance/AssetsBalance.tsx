import { isMobile } from '@utils/browser'
import React from 'react'
import IBCBalance from './IBCBalance'
import XKIBalance from './XKIBalance'

interface AssetsBalanceProps {}

const AssetsBalance: React.FC<AssetsBalanceProps> = ({}) => {
  return isMobile() ? (
    <div className="flex flex-col">
      <div className="mt-[30px] ">
        <XKIBalance />
      </div>
      <div className="mt-[30px] ">
        <IBCBalance />
      </div>
    </div>
  ) : (
    <table className="mt-12 font-semibold">
      <thead className="border-b border-cosmon-main-primary leading-[80px]">
        <th className="text-left text-cosmon-main-tertiary">Assets</th>
        <th className="text-left text-cosmon-main-tertiary">Balance</th>
        <th></th>
        <th className="w-[261px] text-left text-cosmon-main-tertiary">Actions</th>
      </thead>
      <tbody className="text-xl text-white">
        <tr className="h-4"></tr>
        <XKIBalance />
        <IBCBalance />
      </tbody>
    </table>
  )
}

export default AssetsBalance
