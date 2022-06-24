import { CosmonType } from '../../../types/Cosmon'
import { getTrait } from '../../utils/cosmon'
import Close from '/public/icons/close.svg'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Hover from 'react-3d-hover'
import { useEffect } from 'react'

type CosmonFullModalProps = {
  cosmon: CosmonType
  onCloseModal: () => void
}

export default function CosmonFullModal({
  cosmon,
  onCloseModal,
}: CosmonFullModalProps) {
  useEffect(() => {
    document.getElementsByTagName('html')[0].className =
      'overflow-hidden h-full'
    document.getElementsByTagName('body')[0].className =
      'overflow-hidden h-full'
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
              <LazyLoadImage
                height={530}
                width={315}
                effect="opacity"
                src={cosmon.data.extension.image}
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
                <div>Expansive</div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Type’s preference</div>
                <div className="capitalize">
                  {getTrait(cosmon, 'Personality')}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Geographical area</div>
                <div>{getTrait(cosmon, 'Geographical')}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Time Period</div>
                <div>{getTrait(cosmon, 'Time')}</div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="flex flex-col gap-y-1">
              <b className="text-[16px]">Caracteristics</b>
              <div className="mt-3 flex justify-between">
                <div className="text-[#D8D1E7]">Level</div>
                <div className="capitalize">1</div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Health Point</div>
                <div>Coming soon</div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Action Point</div>
                <div>Coming soon</div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Experience Point</div>
                <div>Coming soon</div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Boost</div>
                <div>Coming soon</div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="flex flex-col gap-y-1">
              <b className="text-[16px]">Caracteristics</b>
              <div className="mt-3 flex justify-between">
                <div className="text-[#D8D1E7]">Attack (ATQ)</div>
                <div>Coming soon</div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Speed (SPE)</div>
                <div>Coming soon</div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Chance (LUK)</div>
                <div>Coming soon</div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Defense (DEF)</div>
                <div>Coming soon</div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Psychology (PSY)</div>
                <div>Coming soon</div>
              </div>
              <div className="flex justify-between">
                <div className="text-[#D8D1E7]">Intelligence (INT)</div>
                <div>Coming soon</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
