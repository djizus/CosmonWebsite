import { Disclosure as DisclosureUi } from '@headlessui/react'
import Chevron from '/public/icons/chevron.svg'
type DisclosureProps = {
  title: string
  children: React.ReactNode // content of the disclosure
}

export default function Disclosure({ title, children }: DisclosureProps) {
  return (
    <div className="border-b border-cosmon-gray-4 pb-4 text-left">
      <DisclosureUi>
        {({ open }) => (
          <>
            <DisclosureUi.Button className="flex w-full items-center justify-between py-6 lg:py-[30px]">
              <div className="pr-5 text-left text-[16px] font-semibold leading-[26px] lg:text-[22px]">
                {title}
              </div>
              <Chevron
                className={`h-full flex-none rotate-180 ${
                  open ? '' : 'rotate-0'
                }`}
              />
            </DisclosureUi.Button>

            <DisclosureUi.Panel className="pb-3 text-left text-sm font-light lg:pb-6 lg:text-[16px]">
              {children}
            </DisclosureUi.Panel>
          </>
        )}
      </DisclosureUi>
    </div>
  )
}
