import Button from '../components/Button/Button'
import Disclosure from '../components/Disclosure/Disclosure'

const CallToActionButton = () => {
  return (
    <Button
      icon={{
        direction: 'right',
        position: 'left',
      }}
    >
      Go to help center
    </Button>
  )
}

export default function CommonQuestions() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col justify-between lg:flex-row">
      <div className="max-w-[405px]">
        <h2 className="lg:text-left"> Common questions </h2>
        <div className="hidden pt-10 lg:flex">
          <CallToActionButton />
        </div>
      </div>

      <div className="pt-[60px] lg:-mt-5 lg:w-3/5 lg:pt-0">
        <Disclosure title="What is Cosmon?">
          Cosmon is a play-to-earn digital card game based on NFTs on the Cosmos
          ecosystem. Having a Cosmon NFT give you an exposure to the most
          promising networks of this environment, while enjoying the gameplay
          and pretending to the amazing prize pools.
        </Disclosure>

        <Disclosure title="When will the full gameplay be launched?">
          Cosmon is a play-to-earn digital card game based on NFTs on the Cosmos
          ecosystem. Having a Cosmon NFT give you an exposure to the most
          promising networks of this environment, while enjoying the gameplay
          and pretending to the amazing prize pools.{' '}
        </Disclosure>

        <Disclosure title="On which technology and ecosystem is it based?">
          Cosmon is a play-to-earn digital card game based on NFTs on the Cosmos
          ecosystem. Having a Cosmon NFT give you an exposure to the most
          promising networks of this environment, while enjoying the gameplay
          and pretending to the amazing prize pools.{' '}
        </Disclosure>

        <Disclosure title="On which technology and ecosystem is it based?">
          Cosmon is a play-to-earn digital card game based on NFTs on the Cosmos
          ecosystem. Having a Cosmon NFT give you an exposure to the most
          promising networks of this environment, while enjoying the gameplay
          and pretending to the amazing prize pools.{' '}
        </Disclosure>
      </div>

      <div className="pt-10 lg:hidden">
        <CallToActionButton />
      </div>
    </div>
  )
}
