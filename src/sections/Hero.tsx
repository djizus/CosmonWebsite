import Image from 'next/image'
import Button from '../components/Button/Button'
import HeroBackground from '../../public/hero-background.png'

type HeroProps = {
  children: React.ReactNode
}

export default function Hero({ children }: HeroProps) {
  return (
    <>
      <div className="absolute top-0 left-0 z-0 h-full w-full">
        <Image
          layout="fill"
          className="pointer-events-none object-center"
          src={HeroBackground}
          objectPosition="61%"
          objectFit="cover"
          priority={true}
          quality={75}
        />
      </div>

      <div className="content relative">
        <div className="flex flex-col items-center gap-y-1 pt-36 lg:pt-52">
          <div className="relative h-[78px] w-[254px] lg:h-[202px] lg:w-[655px]">
            <Image layout="fill" priority={true} src={'/logo.png'} />
          </div>
          <div className="relative h-[15px] w-[126px] lg:h-[39px] lg:w-[327px]">
            <Image
              priority={true}
              src={'/protect-the-planet.png'}
              layout="fill"
            />
          </div>
        </div>

        <p className="mx-auto max-w-[598px] pt-[70px] text-lg font-semibold leading-[26px] text-cosmon-gray-8 lg:text-[16px]">
          {children}
        </p>

        <div className="flex flex-col gap-y-8 pt-32 lg:flex-row lg:justify-center lg:gap-x-8 lg:pt-[62px]">
          <Button>Buy Cosmon</Button>
          <Button
            type="secondary"
            icon={{
              position: 'left',
              direction: 'right',
            }}
          >
            Join discord
          </Button>
        </div>
      </div>
    </>
  )
}