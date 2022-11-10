import { CosmonStatType, CosmonType, CosmonTypeWithBoosts } from '../../../types/Cosmon'
import { getCosmonPersonalityAffinity, getCosmonStat, getTrait } from '../../utils/cosmon'
import Close from '/public/icons/close.svg'
import Hover from 'react-3d-hover'
import { useEffect, useMemo } from 'react'
import CosmonCard from '@components/Cosmon/CosmonCard/CosmonCard'
import { CosmonStatProgressionLabel } from '@containers/arena/components/FightReportModal/CosmonsProgression'

type CosmonFullModalProps = {
  cosmon: CosmonTypeWithBoosts
  onCloseModal: () => void
}

export default function CosmonFullModal({ cosmon, onCloseModal }: CosmonFullModalProps) {
  useEffect(() => {
    document.getElementsByTagName('html')[0].className = 'overflow-hidden'
    document.getElementsByTagName('body')[0].className = 'overflow-hidden'
    return function cleanup() {
      document.getElementsByTagName('html')[0].className = ''
      document.getElementsByTagName('body')[0].className = ''
    }
  }, [])

  const statBeforeBoosts = useMemo(() => {
    return cosmon.stats!.reduce<CosmonStatType[]>((acc, stat) => {
      const isStatBoosted = cosmon.boosts.filter((boost) => boost?.boost_name === stat.key)

      if (isStatBoosted.length > 0) {
        const computedValue = isStatBoosted.reduce<number>((result, curr) => {
          if (curr) {
            return Math.floor(result - (curr.inc_value / 100) * result)
          }

          return result
        }, parseInt(stat.value))

        return [
          ...acc,
          {
            key: stat.key,
            value: Math.round(computedValue).toString(),
          },
        ]
      }

      return [...acc, stat]
    }, [])
  }, [cosmon.stats, cosmon.boosts])

  return (
    <div className="fixed top-0 bottom-0 right-0  h-full w-full overflow-auto bg-cosmon-main-secondary pt-[60px] text-white">
      <div className="mx-auto max-w-[1120px]">
        <div className="flex w-full">
          <div className="flex w-full flex-col items-center justify-center gap-x-4 lg:flex-row">
            <h2 className="text-[30px] font-semibold leading-[44px]">
              {cosmon.data.extension.name}
            </h2>
            <div className="flex h-[34px] rounded-lg bg-cosmon-main-primary px-[10px] py-1 text-base font-semibold">
              {getTrait(cosmon, 'Geographical')}
            </div>
          </div>
          <div
            onClick={onCloseModal}
            className="fixed right-5 top-5 cursor-pointer rounded-full bg-cosmon-main-primary p-3 lg:top-10 lg:right-20"
          >
            <Close className="h-[24px] w-[24px]" />
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-center lg:mt-24 lg:flex-row lg:items-start lg:justify-start lg:gap-x-16">
          <div className="self-center lg:sticky lg:top-0 lg:self-start">
            <Hover perspective={300} speed={10}>
              <CosmonCard
                cosmon={cosmon}
                showLevel
                showPersonality
                showScarcity
                showNationality
                size="lg"
                containerStyle={{ height: 530, width: 315 }}
              />
            </Hover>
          </div>

          <div className="mt-10 flex flex-col gap-y-5 px-[20px] lg:mt-0 lg:px-0">
            <b>Biography</b>
            <p
              dangerouslySetInnerHTML={{
                __html: cosmon.data.extension.description,
              }}
              className="mb-20 text-left text-[14px] leading-[20px]"
            ></p>
          </div>

          <div className="top-0 flex min-w-[260px] flex-col gap-y-7 px-[20px] pb-10 text-[14px] lg:sticky lg:mt-0 lg:self-start lg:px-0 lg:pb-0">
            {/* Section 1 */}
            <div className="flex flex-col gap-y-1">
              <b className="text-[16px]">Main Data</b>
              <div className="mt-3 flex justify-between">
                <div className="text-[#D8D1E7]">Type</div>
                <div>{getTrait(cosmon, 'Personality')}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Type’s preference</div>
                <div>{getCosmonPersonalityAffinity(cosmon)}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Geographical area</div>
                <div className="text-right">{getTrait(cosmon, 'Geographical')}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Time Period</div>
                <div>{getTrait(cosmon, 'Time')}</div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="flex flex-col gap-y-1">
              <b className="text-[16px]">Key caracteristics</b>
              <div className="mt-3 flex justify-between">
                <div className="text-[#D8D1E7]">Level</div>
                <div className="capitalize">
                  {statBeforeBoosts ? getCosmonStat(statBeforeBoosts, 'Level')?.value : '-'}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Experience Point</div>
                <div>{statBeforeBoosts ? getCosmonStat(statBeforeBoosts, 'Xp')?.value : '-'}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Health Point</div>
                <div>
                  {statBeforeBoosts ? (
                    <>
                      {getCosmonStat(statBeforeBoosts, 'Hp')?.value}
                      {parseInt(getCosmonStat(cosmon.stats!, 'Hp')?.value!) -
                        parseInt(getCosmonStat(statBeforeBoosts, 'Hp')?.value!) >
                      0 ? (
                        <CosmonStatProgressionLabel
                          className="ml-[4px]"
                          label={`+${
                            parseInt(getCosmonStat(cosmon.stats!, 'Hp')?.value!) -
                            parseInt(getCosmonStat(statBeforeBoosts, 'Hp')?.value!)
                          }`}
                        />
                      ) : null}
                    </>
                  ) : (
                    '-'
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Fight Point</div>
                <div>{statBeforeBoosts ? getCosmonStat(statBeforeBoosts, 'Fp')?.value : '-'}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Action Point</div>
                <div>
                  {statBeforeBoosts ? (
                    <>
                      {getCosmonStat(statBeforeBoosts, 'Ap')?.value}
                      {parseInt(getCosmonStat(cosmon.stats!, 'Ap')?.value!) -
                        parseInt(getCosmonStat(statBeforeBoosts, 'Ap')?.value!) >
                      0 ? (
                        <CosmonStatProgressionLabel
                          className="ml-[4px]"
                          label={`+${
                            parseInt(getCosmonStat(cosmon.stats!, 'Ap')?.value!) -
                            parseInt(getCosmonStat(statBeforeBoosts, 'Ap')?.value!)
                          }`}
                        />
                      ) : null}
                    </>
                  ) : (
                    '-'
                  )}
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="flex flex-col gap-y-1">
              <b className="text-[16px]">Secondary caracteristics</b>
              <div className="mt-3 flex justify-between">
                <div className="text-[#D8D1E7]">Attack (ATQ)</div>
                <div>
                  {statBeforeBoosts ? (
                    <>
                      {getCosmonStat(statBeforeBoosts, 'Atq')?.value}
                      {parseInt(getCosmonStat(cosmon.stats!, 'Atq')?.value!) -
                        parseInt(getCosmonStat(statBeforeBoosts, 'Atq')?.value!) >
                      0 ? (
                        <CosmonStatProgressionLabel
                          className="ml-[4px]"
                          label={`+${
                            parseInt(getCosmonStat(cosmon.stats!, 'Atq')?.value!) -
                            parseInt(getCosmonStat(statBeforeBoosts, 'Atq')?.value!)
                          }`}
                        />
                      ) : null}
                    </>
                  ) : (
                    '-'
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Defense (DEF)</div>
                <div>
                  {statBeforeBoosts ? (
                    <>
                      {getCosmonStat(statBeforeBoosts, 'Def')?.value}
                      {parseInt(getCosmonStat(cosmon.stats!, 'Def')?.value!) -
                        parseInt(getCosmonStat(statBeforeBoosts, 'Def')?.value!) >
                      0 ? (
                        <CosmonStatProgressionLabel
                          className="ml-[4px]"
                          label={`+${
                            parseInt(getCosmonStat(cosmon.stats!, 'Def')?.value!) -
                            parseInt(getCosmonStat(statBeforeBoosts, 'Def')?.value!)
                          }`}
                        />
                      ) : null}
                    </>
                  ) : (
                    '-'
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Intelligence (INT)</div>
                <div>
                  {statBeforeBoosts ? (
                    <>
                      {getCosmonStat(statBeforeBoosts, 'Int')?.value}
                      {parseInt(getCosmonStat(cosmon.stats!, 'Int')?.value!) -
                        parseInt(getCosmonStat(statBeforeBoosts, 'Int')?.value!) >
                      0 ? (
                        <CosmonStatProgressionLabel
                          className="ml-[4px]"
                          label={`+${
                            parseInt(getCosmonStat(cosmon.stats!, 'Int')?.value!) -
                            parseInt(getCosmonStat(statBeforeBoosts, 'Int')?.value!)
                          }`}
                        />
                      ) : null}
                    </>
                  ) : (
                    '-'
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Speed (SPE)</div>
                <div>
                  {statBeforeBoosts ? (
                    <>
                      {getCosmonStat(statBeforeBoosts, 'Spe')?.value}
                      {parseInt(getCosmonStat(cosmon.stats!, 'Spe')?.value!) -
                        parseInt(getCosmonStat(statBeforeBoosts, 'Spe')?.value!) >
                      0 ? (
                        <CosmonStatProgressionLabel
                          className="ml-[4px]"
                          label={`+${
                            parseInt(getCosmonStat(cosmon.stats!, 'Spe')?.value!) -
                            parseInt(getCosmonStat(statBeforeBoosts, 'Spe')?.value!)
                          }`}
                        />
                      ) : null}
                    </>
                  ) : (
                    '-'
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Chance (LUK)</div>
                <div>
                  {statBeforeBoosts ? (
                    <>
                      {getCosmonStat(statBeforeBoosts, 'Luk')?.value}
                      {parseInt(getCosmonStat(cosmon.stats!, 'Luk')?.value!) -
                        parseInt(getCosmonStat(statBeforeBoosts, 'Luk')?.value!) >
                      0 ? (
                        <CosmonStatProgressionLabel
                          className="ml-[4px]"
                          label={`+${
                            parseInt(getCosmonStat(cosmon.stats!, 'Luk')?.value!) -
                            parseInt(getCosmonStat(statBeforeBoosts, 'Luk')?.value!)
                          }`}
                        />
                      ) : null}
                    </>
                  ) : (
                    '-'
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
