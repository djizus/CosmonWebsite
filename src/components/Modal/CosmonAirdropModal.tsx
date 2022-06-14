import { CosmonType } from '../../../types/Cosmon'
import Modal from './Modal'
import useWindowSize from 'react-use/lib/useWindowSize'
import Button from '../Button/Button'
import { useRouter } from 'next/router'
import { Transition } from '@headlessui/react'
import { useEffect, useState } from 'react'
import Image from 'next/image'

type CosmonAirdropModalProps = {
  onCloseModal: () => void
}

export default function CosmonAirdropModal({
  onCloseModal,
}: CosmonAirdropModalProps) {
  const elligible = true
  const alreadyClaimed = true

  const cosmonEligibilitySection = (
    <ul className="ml-8 flex flex-col gap-y-1 text-left text-sm">
      <li className="list-disc ">
        Cosmos, Osmosis and Juno stakers
        <span className="font-normal">
          (out of the top 10 validators, with a minimum threshold determined at
          25 $ATOM, 100 $OSMO, 50 $JUNO)
        </span>
      </li>
      <li className="list-disc ">All Ki Chain stakers</li>
      <li className="list-disc ">All Klub staking delegators</li>
    </ul>
  )

  return (
    <>
      <Modal onCloseModal={onCloseModal}>
        <div className="flex min-w-[533px] flex-col items-center justify-center text-white">
          <h3 className="text-[22px] font-semibold leading-8">
            Cosmon airdrop{' '}
          </h3>

          <div className="mt-8 mb-5 px-5">
            <div className="rounded-[20px] bg-[#312E5A] bg-opacity-50 px-[24px] py-6">
              {!elligible ? (
                <div className="px-4">
                  <h4 className="mb-5 text-lg font-semibold leading-[26px]">
                    Oh... Unfortunatly you’re not eligible
                  </h4>
                  <p className="mb-4 text-sm font-normal">
                    The airdrop snapshot has been taken on Wednesday June 1st,
                    and include:
                  </p>
                  {cosmonEligibilitySection}
                </div>
              ) : (
                <div className="text-center">
                  {!alreadyClaimed && (
                    <Image
                      layout="fixed"
                      width="387px"
                      height="274px"
                      src={'../cosmon-aidrop-cards-when-elligible.png'}
                    />
                  )}

                  <h4 className="mb-5 mt-2 text-lg font-semibold leading-[26px]">
                    {alreadyClaimed
                      ? 'You already claimed all your Cosmon airdrop'
                      : 'Congrats, you’re eligible to 3 Cosmon airdrop!'}
                  </h4>

                  <p className="mb-4 text-sm font-normal">
                    You get 1 Cosmon airdrop (3 max.) for each condition
                    fulfilled as follows (snapshot taken on June 1st), within
                    the limits of available stocks (50k Cosmons - first-come,
                    first-served basis):
                  </p>
                  {cosmonEligibilitySection}
                </div>
              )}
            </div>
          </div>

          {!alreadyClaimed && (
            <div className="flex py-5">
              {elligible ? (
                <>
                  <Button size="small" onClick={onCloseModal}>
                    I understand
                  </Button>
                </>
              ) : (
                <Button size="small" onClick={onCloseModal}>
                  Claim airdrop
                </Button>
              )}
              {/* <Button size="small" type="secondary" onClick={onCloseModal}>
              Close
            </Button> */}
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}
