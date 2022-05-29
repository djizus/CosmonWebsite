import Button from '../components/Button/Button'
import Image from 'next/image'

export default function Treasury() {
  return (
    <div className="mx-auto items-center justify-between lg:flex lg:max-w-6xl">
      <div>
        <div className="-ml-[50px] w-[calc(100%_+_100px)] lg:-ml-44 lg:-mr-10 lg:w-[720px]">
          <Image
            objectFit="cover"
            layout="responsive"
            src="treasury/treasury-managment-illustration.png"
            width="100%"
            height="100%"
          />
        </div>
      </div>
      <div className="lg:ml-6 ">
        <h2 className="lg:text-left">Treasury management</h2>
        <p className="pt-10 lg:max-w-xl lg:text-left">
          All the proceeds of the NFT sales will be pooled in a decentralized
          treasury to get an exposure to the most promising Cosmos-based tokens.
          These assets will be used to secure the associated networks, fueling
          the $XKI returns thanks to the inflation of targeted protocols.
        </p>

        <p className="pt-4 lg:text-left">
          This unique approach is at the origin of the key tokenomics dimension
          of Cosmon:{' '}
        </p>

        <ul className="flex flex-col gap-y-6 px-6 pt-4  text-center lg:ml-2 lg:text-left">
          <li className="list-disc">
            {/* <li className="list-disc text-[8px]"> */}
            {/* <div className="text-base"> */} Bring a growing fondamental
            value to the Cosmons NFTs
            {/* </div> */}
          </li>
          <li className="list-disc">
            Provide recurring $XKI returns to their holders to be used ingame
          </li>
          <li className="list-disc">
            Fuel the prize pools of the different leagues
          </li>
        </ul>
        <div className="pt-[60px]">
          <Button
            type="secondary"
            icon={{
              position: 'left',
              direction: 'right',
            }}
          >
            Learn more
          </Button>
        </div>
      </div>
    </div>
  )
}
