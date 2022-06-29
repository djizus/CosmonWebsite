import Button from '../components/Button/Button'
import Disclosure from '../components/Disclosure/Disclosure'

const CallToActionButton = () => {
  return (
    <Button
      icon={{
        direction: 'right',
        position: 'left',
      }}
      onClick={() =>
        window.open(
          `https://inky-sidewalk-879.notion.site/Cosmon-white-paper-722dc48d832a49e9ae348eaf94184706`,
          '_blank'
        )
      }
    >
      Read our light paper
    </Button>
  )
}

export default function CommonQuestions() {
  return (
    <div className="mx-auto flex w-full max-w-[1088px] flex-col justify-between lg:flex-row lg:gap-x-40">
      <div className="max-w-[405px]">
        <h2 className="lg:text-left"> Common questions </h2>
        <div className="hidden pt-10 lg:flex">
          <CallToActionButton />
        </div>
      </div>

      <div className="pt-[60px] lg:-mt-5 lg:w-2/3 lg:pt-0">
        <Disclosure title="What is Cosmon?">
          Cosmon is a play-to-earn digital card game based on NFTs on the Cosmos
          ecosystem. Having a Cosmon NFT give you an exposure to the most
          promising networks of this environment, while enjoying the gameplay
          and pretending to the amazing prize pools.
        </Disclosure>

        <Disclosure title="When will the full gameplay be launched?">
          The gameplay is still under development, with a planned release for
          late S3 2022. The first phase from S1 to S2 2022 will be dedicated to
          the release of Cosmon NFTs through different sales operation.
        </Disclosure>

        <Disclosure title="On which technology and ecosystem is it based?">
          Cosmon is based on Cosmos, an ecosystem of interoperable blockchains.
          Each blockchain of this ecosystem is running on the same protocol to
          smoothly exchange value and data. For these reasons, Cosmos is often
          described as an “Internet of Blockchain”.
        </Disclosure>

        <Disclosure title="What are the sales proceeds used for?">
          The proceeds from the NFT sales are fueling a decentralized treasury
          used to secure different blockchains in the Cosmos ecosystem,
          providing $XKI returns thanks to their respective inflation. It is
          managed by Klub and the Ki foundation.
        </Disclosure>
      </div>

      <div className="pt-10 lg:hidden">
        <CallToActionButton />
      </div>
    </div>
  )
}
