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
          treasury and invested in the most promising Cosmos-based tokens.
        </p>

        <p className="pt-10 lg:text-left">All Yield generated goes to: </p>

        <ul className="flex flex-col gap-y-6 px-6 pt-6  text-center lg:ml-3 lg:text-left">
          <li className="list-disc">
            All the proceeds of the NFT sales will be pooled in a decentralized
            treasury and invested in the most promising Cosmos-based tokens.
          </li>
          <li className="list-disc">
            All the proceeds of the NFT sales will be pooled in a decentralized
            treasury and invested in the most promising Cosmos-based tokens.
          </li>
          <li className="list-disc">
            All the proceeds of the NFT sales will be pooled in a decentralized
            treasury and invested in the most promising Cosmos-based tokens.
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
