import Button from '@components/Button/Button'
import { convertMicroDenomToDenom } from '@utils/conversion'
import numeral from 'numeral'
import { PrizesForAddress } from 'types'
import * as style from './ClaimBanner.module.scss'

interface Props {
  prizesForAddress: PrizesForAddress
  loading: boolean
  onClickClaim: () => void
}

const ClaimBanner: React.FC<Props> = ({ prizesForAddress, onClickClaim, loading }) => {
  return (
    <div className={style.claimBanner}>
      <p className={style.label}>{`Well played, you just won ${numeral(
        convertMicroDenomToDenom(prizesForAddress.to_claim[0].amount)
      ).format('0,0')} XKI`}</p>
      <Button onClick={onClickClaim} isLoading={loading}>{`Claim rewards: ${numeral(
        convertMicroDenomToDenom(prizesForAddress.to_claim[0].amount)
      ).format('0,0')} XKI`}</Button>
    </div>
  )
}

ClaimBanner.displayName = 'ClaimBanner'

export default ClaimBanner
