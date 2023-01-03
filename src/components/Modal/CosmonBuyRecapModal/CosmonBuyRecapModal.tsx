import Button from '@components/Button/Button'
import CosmonCard from '@components/Cosmon/CosmonCard/CosmonCard'
import Modal from '@components/Modal/Modal'
import {
  CosmonStatProgressionLabel,
  CosmonXpProgression,
} from '@containers/arena/components/FightReportModal/CosmonsProgression'
import { convertMicroDenomToDenom } from '@utils/conversion'
import { getCosmonStat } from '@utils/cosmon'
import React, { useMemo } from 'react'
import { CosmonMarketPlaceType } from 'types'
import * as style from './CosmonBuyRecapModal.module.scss'

interface Props {
  cosmon: CosmonMarketPlaceType
  handleCloseModal: () => void
}

const CosmonBuyRecapModal: React.FC<Props> = ({ cosmon, handleCloseModal }) => {
  const floorXp = parseInt(getCosmonStat(cosmon.stats, 'Floor Level')?.value ?? '0')
  const NextLevelXp = parseInt(getCosmonStat(cosmon.stats, 'Next Level')?.value ?? '0')

  const currentXpPercent = useMemo(() => {
    const xpPercent = (floorXp / NextLevelXp) * 100
    return xpPercent
  }, [floorXp, NextLevelXp])

  return (
    <Modal subContainerClassname={style.modal} onCloseModal={handleCloseModal} hasCloseButton>
      <p className={style.title}>Buy recap</p>
      <div className={style.card}>
        <p className={style.cosmonNumber}>Cosmon #{cosmon.id}</p>
        <p className={style.price}>{cosmon.price} XKI</p>
        <div className={style.experienceContainer}>
          <p className={style.level}>Level {getCosmonStat(cosmon.stats, 'Level')?.value}</p>
          <p className={style.xp}>
            <span className={style.xpBold}>
              {getCosmonStat(cosmon.stats, 'Floor Level')?.value}
            </span>{' '}
            /{getCosmonStat(cosmon.stats, 'Next Level')?.value}
          </p>
        </div>
        <div className={style.xpBarreContainer}>
          <div className={style.xpBarre} style={{ width: `${currentXpPercent}%` }} />
        </div>
        <div className={style.cosmonData}>
          <CosmonCard
            className={style.cosmonCard}
            size="md"
            showLevel
            showScarcity
            showNationality
            showPersonality
            cosmon={cosmon}
          />
          <div className={style.statsContainer}>
            <div className={style.statsLine}>
              <p className={style.label}>Attack (ATQ)</p>
              <p className={style.value}>
                {cosmon.statsWithoutBoosts ? (
                  <>
                    {getCosmonStat(cosmon.statsWithoutBoosts, 'Atq')?.value}
                    {parseInt(getCosmonStat(cosmon.stats!, 'Atq')?.value!) -
                      parseInt(getCosmonStat(cosmon.statsWithoutBoosts, 'Atq')?.value!) >
                    0 ? (
                      <CosmonStatProgressionLabel
                        label={`+${
                          parseInt(getCosmonStat(cosmon.stats!, 'Atq')?.value!) -
                          parseInt(getCosmonStat(cosmon.statsWithoutBoosts, 'Atq')?.value!)
                        }`}
                      />
                    ) : null}
                  </>
                ) : (
                  '-'
                )}
              </p>
            </div>
            <div className={style.statsLine}>
              <p className={style.label}>Speed (SPE)</p>
              <p className={style.value}>
                {cosmon.statsWithoutBoosts ? (
                  <>
                    {getCosmonStat(cosmon.statsWithoutBoosts, 'Spe')?.value}
                    {parseInt(getCosmonStat(cosmon.stats!, 'Spe')?.value!) -
                      parseInt(getCosmonStat(cosmon.statsWithoutBoosts, 'Spe')?.value!) >
                    0 ? (
                      <CosmonStatProgressionLabel
                        label={`+${
                          parseInt(getCosmonStat(cosmon.stats!, 'Spe')?.value!) -
                          parseInt(getCosmonStat(cosmon.statsWithoutBoosts, 'Spe')?.value!)
                        }`}
                      />
                    ) : null}
                  </>
                ) : (
                  '-'
                )}
              </p>
            </div>
            <div className={style.statsLineSeparation}>
              <p className={style.label}>Chance (LUK)</p>
              <p className={style.value}>
                {cosmon.statsWithoutBoosts ? (
                  <>
                    {getCosmonStat(cosmon.statsWithoutBoosts, 'Luk')?.value}
                    {parseInt(getCosmonStat(cosmon.stats!, 'Luk')?.value!) -
                      parseInt(getCosmonStat(cosmon.statsWithoutBoosts, 'Luk')?.value!) >
                    0 ? (
                      <CosmonStatProgressionLabel
                        label={`+${
                          parseInt(getCosmonStat(cosmon.stats!, 'Luk')?.value!) -
                          parseInt(getCosmonStat(cosmon.statsWithoutBoosts, 'Luk')?.value!)
                        }`}
                      />
                    ) : null}
                  </>
                ) : (
                  '-'
                )}
              </p>
            </div>
            <div className={style.statsLine}>
              <p className={style.secondLabel}>Defense (DEF)</p>
              <p className={style.value}>
                {cosmon.statsWithoutBoosts ? (
                  <>
                    {getCosmonStat(cosmon.statsWithoutBoosts, 'Def')?.value}
                    {parseInt(getCosmonStat(cosmon.stats!, 'Def')?.value!) -
                      parseInt(getCosmonStat(cosmon.statsWithoutBoosts, 'Def')?.value!) >
                    0 ? (
                      <CosmonStatProgressionLabel
                        label={`+${
                          parseInt(getCosmonStat(cosmon.stats!, 'Def')?.value!) -
                          parseInt(getCosmonStat(cosmon.statsWithoutBoosts, 'Def')?.value!)
                        }`}
                      />
                    ) : null}
                  </>
                ) : (
                  '-'
                )}
              </p>
            </div>
            <div className={style.statsLine}>
              <p className={style.secondLabel}>Health point (HP)</p>
              <p className={style.value}>
                {cosmon.statsWithoutBoosts ? (
                  <>
                    {getCosmonStat(cosmon.statsWithoutBoosts, 'Hp')?.value}
                    {parseInt(getCosmonStat(cosmon.stats!, 'Hp')?.value!) -
                      parseInt(getCosmonStat(cosmon.statsWithoutBoosts, 'Hp')?.value!) >
                    0 ? (
                      <CosmonStatProgressionLabel
                        label={`+${
                          parseInt(getCosmonStat(cosmon.stats!, 'Hp')?.value!) -
                          parseInt(getCosmonStat(cosmon.statsWithoutBoosts, 'Hp')?.value!)
                        }`}
                      />
                    ) : null}
                  </>
                ) : (
                  '-'
                )}
              </p>
            </div>
            <div className={style.statsLine}>
              <p className={style.secondLabel}>Intelligence (INT)</p>
              <p className={style.value}>
                {cosmon.statsWithoutBoosts ? (
                  <>
                    {getCosmonStat(cosmon.statsWithoutBoosts, 'Int')?.value}
                    {parseInt(getCosmonStat(cosmon.stats!, 'Int')?.value!) -
                      parseInt(getCosmonStat(cosmon.statsWithoutBoosts, 'Int')?.value!) >
                    0 ? (
                      <CosmonStatProgressionLabel
                        label={`+${
                          parseInt(getCosmonStat(cosmon.stats!, 'Int')?.value!) -
                          parseInt(getCosmonStat(cosmon.statsWithoutBoosts, 'Int')?.value!)
                        }`}
                      />
                    ) : null}
                  </>
                ) : (
                  '-'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      <p className={style.thxText}>
        Thank you for your purchase, you can find your
        <br />
        new leader in your assets page.
      </p>
      <Button className={style.closeButton} onClick={handleCloseModal}>
        Close
      </Button>
    </Modal>
  )
}

CosmonBuyRecapModal.displayName = 'CosmonBuyRecapModal'

export default CosmonBuyRecapModal
