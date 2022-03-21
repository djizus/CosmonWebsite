import Button from '../components/Button/Button'
import Image from 'next/image'

export default function Treasury() {
  return (
    <>
      <div className="-ml-[50px] w-[calc(100%_+_100px)]">
        <Image
          objectFit="cover"
          layout="responsive"
          src="treasury/treasury-managment-illustration.png"
          width="100%"
          height="100%"
        />
      </div>
      <h2>Treasury management</h2>
      <p className="pt-10">
        All the proceeds of the NFT sales will be pooled in a decentralized
        treasury and invested in the most promising Cosmos-based tokens.
      </p>

      <p className="pt-10">All Yield generated goes to: </p>

      <ul className="flex flex-col gap-y-6 px-6 pt-6">
        <li className="list-disc">
          Bring a growing fondamental value to the Cosmons NFTs
        </li>
        <li className="list-disc">
          Provide recurring $XKI returns to their holders to be used ingame
        </li>
        <li className="list-disc">
          Fuel the prize pools of the different leagues
        </li>
      </ul>
      <div className="pt-[60px]">
        <Button type="secondary" withDirection="right">
          Learn more
        </Button>
      </div>
    </>
  )
}
