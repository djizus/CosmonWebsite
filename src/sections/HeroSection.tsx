import Image from 'next/image'
import Button from '../components/Button/Button'

type HeroSectionProps = {
  children: React.ReactNode
}

export default function HeroSection({ children }: HeroSectionProps) {
  return (
    <>
      <div
        className="absolute top-0 left-0 -z-10 h-[695px] w-full"
        // style={{
        //   background: 'url(/hero-background.png)',
        //   backgroundSize: 'cover',
        //   backgroundPosition: '60% 0%',
        // }}
      >
        <Image
          layout="fill"
          className="pointer-events-none object-cover object-center"
          src={'/hero-background.png'}
          objectPosition="60%"
          objectFit="cover"
          priority={true}
          quality={100}
        />
      </div>

      <div className="mt-[106px] flex flex-col items-center gap-y-1">
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

      <p className="mt-[70px] px-10 text-center text-lg font-semibold leading-[26px] text-cosmon-gray-8">
        {children}
      </p>

      <div className="pt-32">
        <Button type="primary">Buy Cosmon</Button>
      </div>
    </>
  )
}
