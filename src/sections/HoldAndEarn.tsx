import Button from '../components/Button/Button'
import Image from 'next/image'

export default function HoldAndEarn() {
  return (
    <>
      <Image
        layout="responsive"
        objectFit="cover"
        src="/hold-and-earn/cards-background.png"
        width="100%"
        height="100%"
      />

      <h2 className="pt-10">
        Hold Cosmon, <br /> Earn $XKI
      </h2>
      <p className="pt-8">
        Cosmons holders will benefit of recurring payment in the $XKI utility
        token, representing a cash flow to incentivize players to hold their
        NFTs, increasing their scarcity on the secondary market. It will also
        provide a daily fuel to be used ingame.
        <br />
        <br />
        Cosmons holders will benefit of recurring payment in the $XKI utility
        token, representing a cash flow to incentivize players to hold their
        NFTs, increasing their scarcity on the secondary market. It will also
        provide a daily fuel to be used ingame.
      </p>
      <div className="pt-10">
        <Button>Buy Cosmon</Button>
      </div>
    </>
  )
}
