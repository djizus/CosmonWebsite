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
        <div className="flex flex-col items-center gap-y-1 pt-36">
          <Image
            layout="fixed"
            priority={true}
            src={'/logo.png'}
            width={254}
            height={78}
          />
          <Image
            priority={true}
            src={'/protect-the-planet.png'}
            layout="fixed"
            width={126}
            height={15}
          />
        </div>

        <p className="pt-[70px] text-lg font-semibold leading-[26px] text-cosmon-gray-8">
          {children}
        </p>

        <div className="flex flex-col gap-y-8 pt-32">
          <Button>Buy Cosmon</Button>
          <Button type="secondary" withDirection="right">
            Join discord
          </Button>
        </div>
      </div>
    </>
  )
}
