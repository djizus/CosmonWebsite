import Image from 'next/image'
import Button from '../components/Button/Button'
import ChooseYourLeadersBackground from '/public/choose-your-leaders/choose-your-leaders-background.png'

export default function ChooseYourLeaders() {
  return (
    <>
      <div className="absolute top-[160px] left-0 z-0 h-full w-full">
        <Image
          layout="fill"
          className="pointer-events-none object-center"
          src={ChooseYourLeadersBackground}
          objectPosition="50%"
          objectFit="cover"
          quality={75}
        />
      </div>
      <div className="relative">
        <h2 className="">Choose your Leaders</h2>
        <p className="pt-6">
          On the eve of the greatest battle in history, build your deck with the
          best conquerors and leaders of all time. Different personalities and
          strengths with one common goal: to win that war.{' '}
        </p>
        <div className="pt-8">
          <Button>Buy cosmon</Button>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-full w-full">
        <div className="absolute bottom-0  right-12">
          <Image
            layout="fixed"
            width="119px"
            height="161px"
            className="pointer-events-none"
            src={'/choose-your-leaders/leaders/leader-1.png'}
          />
        </div>
        <div className="absolute -bottom-11 w-full text-center">
          <Image
            layout="fixed"
            width="144px"
            height="160px"
            className="pointer-events-none"
            src={'/choose-your-leaders/leaders/leader-2.png'}
          />
        </div>
        <div className="absolute bottom-0 left-11">
          <Image
            layout="fixed"
            width="112px"
            height="160px"
            className="pointer-events-none"
            src={'/choose-your-leaders/leaders/leader-3.png'}
          />
        </div>
      </div>
    </>
  )
}
