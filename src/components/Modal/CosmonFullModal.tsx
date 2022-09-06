import { CosmonType } from '../../../types/Cosmon'
import { getCosmonPersonalityAffinity, getCosmonStat, getTrait } from '../../utils/cosmon'
import Close from '/public/icons/close.svg'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Hover from 'react-3d-hover'
import { useEffect } from 'react'
import CosmonCard from '@components/Cosmon/CosmonCard/CosmonCard'

type CosmonFullModalProps = {
  cosmon: CosmonType
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

  return (
    <div className="fixed top-0 bottom-0 right-0  h-full w-full overflow-auto bg-cosmon-main-secondary pt-[60px] text-white">
      <div className="mx-auto max-w-[1120px]">
        <div className="flex w-full">
          <div className="flex w-full items-center justify-center gap-x-4">
            <h2 className="text-[30px] font-semibold leading-[44px]">
              {cosmon.data.extension.name}
            </h2>
            <div className="flex h-[34px] rounded-lg bg-cosmon-main-primary px-[10px] py-1 text-base font-semibold">
              {getTrait(cosmon, 'Geographical')}
            </div>
          </div>
          <div
            onClick={onCloseModal}
            className="fixed right-20 cursor-pointer rounded-full bg-cosmon-main-primary p-3"
          >
            <Close className="h-[24px] w-[24px]" />
          </div>
        </div>

        <div className="mt-24 flex items-start gap-x-16">
          <div className="sticky top-0 self-start">
            <Hover perspective={300} speed={10}>
              <CosmonCard
                cosmon={cosmon}
                showLevel
                showPersonality
                size="lg"
                containerStyle={{ height: 530, width: 315 }}
              />
            </Hover>
          </div>
          <div className="flex flex-col gap-y-5">
            <b>Biography</b>
            <p
              dangerouslySetInnerHTML={{
                __html: cosmon.data.extension.description,
              }}
              className="mb-20 text-left text-[14px] leading-[20px]"
            ></p>
          </div>

          <div className="sticky top-0 flex min-w-[260px] flex-col gap-y-7 self-start text-[14px]">
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
                  {cosmon.stats ? getCosmonStat(cosmon.stats, 'Level')?.value : '-'}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Experience Point</div>
                <div>{cosmon.stats ? getCosmonStat(cosmon.stats, 'Xp')?.value : '-'}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Health Point</div>
                <div>{cosmon.stats ? getCosmonStat(cosmon.stats, 'Hp')?.value : '-'}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Fight Point</div>
                <div>{cosmon.stats ? getCosmonStat(cosmon.stats, 'Fp')?.value : '-'}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Action Point</div>
                <div>{cosmon.stats ? getCosmonStat(cosmon.stats, 'Ap')?.value : '-'}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Boost</div>
                <div>Coming soon</div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="flex flex-col gap-y-1">
              <b className="text-[16px]">Secondary caracteristics</b>
              <div className="mt-3 flex justify-between">
                <div className="text-[#D8D1E7]">Attack (ATQ)</div>
                <div>{cosmon.stats ? getCosmonStat(cosmon.stats, 'Atq')?.value : '-'}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Defense (DEF)</div>
                <div>{cosmon.stats ? getCosmonStat(cosmon.stats, 'Def')?.value : '-'}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Intelligence (INT)</div>
                <div>{cosmon.stats ? getCosmonStat(cosmon.stats, 'Int')?.value : '-'}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Speed (SPE)</div>
                <div>{cosmon.stats ? getCosmonStat(cosmon.stats, 'Spe')?.value : '-'}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Chance (LUK)</div>
                <div>{cosmon.stats ? getCosmonStat(cosmon.stats, 'Luk')?.value : '-'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
