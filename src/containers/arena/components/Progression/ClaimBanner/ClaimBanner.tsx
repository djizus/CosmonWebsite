import Button from '@components/Button/Button'
import { convertMicroDenomToDenom } from '@utils/conversion'
import numeral from 'numeral'
import { useMemo } from 'react'
import { PrizesForAddress } from 'types'
import * as style from './ClaimBanner.module.scss'

interface Props {
  prizesForAddress: PrizesForAddress
  loading: boolean
  onClickClaim: () => void
}

const ClaimBanner: React.FC<Props> = ({ prizesForAddress, onClickClaim, loading }) => {
  const amountFormatted = useMemo(() => {
    return numeral(convertMicroDenomToDenom(prizesForAddress.to_claim[0].amount)).format('0,0')
  }, [prizesForAddress])

  const twitterLink = `https://twitter.com/intent/tweet?text=It%E2%80%99s%20crazy%2C%20I%20just%20won%20the%20%40PlayCosmon%20championship%20this%20week%20%21%20I%20just%20earned%20${amountFormatted}%20%24XKI%21%20Come%20play%20with%20me%20on%20cosmon.ki`

  return (
    <div className={style.claimBanner}>
      <p className={style.label}>{`Well played, you just won ${amountFormatted} XKI`}</p>
      <div className="flex gap-[25px]">
        <Button
          size="small"
          onClick={onClickClaim}
          isLoading={loading}
        >{`Claim rewards: ${amountFormatted} XKI`}</Button>
        <a href={twitterLink} target={'_blank'}>
          <Button size="small">Share on Twitter</Button>
        </a>
      </div>
    </div>
  )
}

ClaimBanner.displayName = 'ClaimBanner'

export default ClaimBanner
