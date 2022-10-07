import Button from '@components/Button/Button'
import { PrizesForAddress } from 'types'
import * as style from './ClaimBanner.module.scss'

interface Props {
  prizesForAddress: PrizesForAddress
}

const ClaimBanner: React.FC<Props> = ({ prizesForAddress }) => {
  return (
    <div className={style.claimBanner}>
      <p className={style.label}>{`Well played, you just won ${prizesForAddress.to_claim[0]}`}</p>
      <Button>{`Claim rewards: ${prizesForAddress.to_claim[0]}`}</Button>
    </div>
  )
}

ClaimBanner.displayName = 'ClaimBanner'

export default ClaimBanner
