import Modal from './Modal'
import Button from '../Button/Button'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useWalletStore } from '../../store/walletStore'
import { CosmonType } from '../../../types/Cosmon'
import CosmonAcquiredModal from './CosmonAcquiredModal'
import { useRouter } from 'next/router'
import { useAirdropStore } from '../../store/airdropStore'
import { isMobile } from '@utils/browser'

type CosmonAirdropModalProps = {
  onCloseModal: () => void
}

export default function CosmonAirdropModal({ onCloseModal }: CosmonAirdropModalProps) {
  const { airdropData, claimAirdrop } = useAirdropStore((state) => state)
  const [cosmonClaimed, set_cosmonClaimed] = useState<undefined | CosmonType>()
  const router = useRouter()

  const getRemainingAirdrop = () => {
    if (airdropData?.max_claimable && airdropData?.num_already_claimed) {
      return `(${airdropData.max_claimable - airdropData.num_already_claimed})`
    }
  }

  const claim = async () => {
    try {
      const cosmonClaimed = await claimAirdrop()
      set_cosmonClaimed(undefined)
      set_cosmonClaimed(cosmonClaimed)
    } catch (e: any) {
      console.error('Error! ', e)
    } finally {
    }
  }

  const cosmonEligibilitySection = (
    <>
      See detailed rules{' '}
      <a
        className="font-semibold underline"
        target="_blank"
        href="https://medium.com/ki-foundation/cosmon-stakedrop-da5120d5b879"
      >
        in our announcement post.
      </a>
    </>
  )

  return (
    <>
      {cosmonClaimed ? (
        <CosmonAcquiredModal
          cosmon={cosmonClaimed}
          actions={
            <div className="flex gap-x-8 pt-[60px] pb-2">
              <Button size="small" type="secondary" onClick={() => router.push('my-assets')}>
                See my assets
              </Button>
              {airdropData?.num_already_claimed !== airdropData?.max_claimable && (
                <Button
                  size="small"
                  onClick={() => {
                    // set_cosmonClaimed(undefined)
                    claim()
                  }}
                >
                  Claim again {getRemainingAirdrop()}
                </Button>
              )}
            </div>
          }
          onCloseModal={() => set_cosmonClaimed(undefined)}
        />
      ) : (
        <Modal
          onCloseModal={onCloseModal}
          {...(isMobile() ? { fullScreen: true } : { width: 600 })}
        >
          <div className="flex min-w-[533px] flex-col items-center justify-center text-white">
            <h3 className="text-[22px] font-semibold leading-8">Cosmon airdrop </h3>

            <div className="mt-8 mb-5 px-5">
              <div className="rounded-[20px] bg-[#312E5A] bg-opacity-50 px-[24px] py-6">
                {!airdropData?.isEligible ? (
                  <div className="px-4">
                    <h4 className="mb-5 text-lg font-semibold leading-[26px]">
                      Oh... Unfortunately you’re not eligible
                    </h4>
                    <p className="mb-4 text-sm font-normal">
                      The airdrop snapshot has been taken on Wednesday June 1st 2022.{' '}
                      {cosmonEligibilitySection}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    {airdropData.max_claimable !== airdropData.num_already_claimed && (
                      <Image
                        layout="fixed"
                        width="387px"
                        height="274px"
                        src={'../cosmon-aidrop-cards-when-elligible.png'}
                      />
                    )}

                    <h4 className="mb-5 mt-2 text-lg font-semibold leading-[26px]">
                      {airdropData.max_claimable === airdropData.num_already_claimed
                        ? 'You already claimed all your Cosmon airdrop'
                        : `Congrats, you’re eligible to ${airdropData.max_claimable} Cosmon airdrop!`}
                    </h4>

                    <p className="mb-4 text-sm font-normal">
                      You get 1 Cosmon airdrop for each condition fulfilled as follows (snapshot
                      taken on June 1st), within the limits of available stocks (50k Cosmons -
                      first-come, first-served basis):
                    </p>
                    <div className="font-normal">{cosmonEligibilitySection}</div>
                  </div>
                )}
              </div>
            </div>

            {airdropData?.max_claimable !== airdropData?.num_already_claimed && (
              <div className="flex py-5">
                {airdropData?.isEligible ? (
                  <Button className="text-base" size="small" onClick={claim}>
                    Claim airdrop {getRemainingAirdrop()}
                  </Button>
                ) : (
                  <>
                    <Button size="small" onClick={onCloseModal}>
                      I understand
                    </Button>
                  </>
                )}
                {/* <Button size="small" type="secondary" onClick={onCloseModal}>
              Close
            </Button> */}
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  )
}
