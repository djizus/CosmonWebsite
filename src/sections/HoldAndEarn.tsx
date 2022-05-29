import Button from '../components/Button/Button'
import Image from 'next/image'
import router from 'next/router'

export default function HoldAndEarn() {
  return (
    <>
      <div className="lg:mx-auto lg:flex lg:max-w-6xl lg:flex-row-reverse lg:items-center lg:justify-between">
        <div className="relative lg:w-1/2">
          <Image
            layout="responsive"
            objectFit="contain"
            src="/hold-and-earn/cards-background.png"
            width="100%"
            height="100%"
          />
        </div>

        <div className="lg:w-[44%] ">
          <h2 className="mx-auto max-w-sm pt-10 lg:max-w-none lg:pt-0 lg:text-left">
            Hold Cosmon, Earn $XKI
          </h2>
          <p className="pt-8 lg:pt-[40px] lg:pr-12 lg:text-left">
            Cosmons holders will benefit of recurring $XKI return, providing to
            players a daily fuel to boost their Cosmon performance. The $XKI
            returns are increasing with the rarity levels of your Cosmons!
          </p>
          <div className="pt-10 lg:pt-[60px]">
            <Button onClick={() => router.push('/buy-cosmon')}>
              Buy Cosmon
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
