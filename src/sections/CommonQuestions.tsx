import Button from '../components/Button/Button'
import Disclosure from '../components/Disclosure/Disclosure'

export default function CommonQuestions() {
  return (
    <>
      <h2> Common questions </h2>

      <div className="pt-[60px]">
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
      </div>

      <div className="pt-10">
        <Button withDirection="right">Go to help center</Button>
      </div>
    </>
  )
}
