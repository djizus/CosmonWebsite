import Image from 'next/image'
import router from 'next/router'
import Button from '../components/Button/Button'
import ChooseYourLeadersBackground from '/public/choose-your-leaders/choose-your-leaders-background.png'

export default function ChooseYourLeaders() {
  const LeadersIllustration = () => (
    <>
      <div className="relative h-[161px] w-[119px]">
        <Image
          layout="fixed"
          width="119px"
          height="161px"
          src={'/choose-your-leaders/leaders/leader-1.png'}
        />
      </div>
      <div className="relative -mx-7 mt-10">
        <Image
          layout="fixed"
          width="144px"
          height="160px"
          src={'/choose-your-leaders/leaders/leader-2.png'}
        />
      </div>
      <div className="relative">
        <Image
          layout="fixed"
          width="112px"
          height="160px"
          src={'/choose-your-leaders/leaders/leader-3.png'}
        />
      </div>
    </>
  )

  return (
    <>
      <div className="absolute top-[160px] left-0 z-0 h-full w-full lg:top-0">
        <Image
          layout="fill"
          className="pointer-events-none object-center"
          src={ChooseYourLeadersBackground}
          objectPosition="50%"
          objectFit="cover"
          quality={75}
        />
      </div>
      <div className="relative mx-auto max-w-[598px]">
        <h2>Choose your Leaders</h2>
        <p className="pt-6">
          On the eve of the greatest battle in history, build your deck with the
          best conquerors and leaders of all time. Different personalities and
          strengths with one common goal: to win that war.{' '}
        </p>
        <div className="flex justify-center pt-8 lg:pt-16">
          <Button onClick={() => router.push('/buy-cosmon')}>Buy cosmon</Button>
        </div>
      </div>
      <div className="absolute -bottom-24 left-0 flex w-full justify-center overflow-hidden lg:bottom-24 lg:justify-start lg:pl-12">
        <LeadersIllustration />
      </div>

      <div className="absolute -bottom-24 left-0 hidden w-full justify-center overflow-hidden lg:bottom-24 lg:flex lg:justify-end lg:pr-12">
        <LeadersIllustration />
      </div>
    </>
  )
}
