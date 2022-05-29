import Image from 'next/image'

export default function Partners() {
  return (
    <div className="mx-auto max-w-6xl">
      <h2>Early supports and partners</h2>
      <p className="mx-auto max-w-[860px] pt-[30px] text-lg leading-8">
        Cosmon is an in initiative from Klub and the Ki Foundation. We are
        working on some of the most promising Cosmos-based projects, including
        Cosmos Hub, Osmosis, Juno, Stargaze, Persistence, Akash, Sentinel,
        Comdex, and Lum. Playing to Cosmon will give you an exposition to these
        projects and to their underlying networks. More partners and supporters
        to come soon!
      </p>

      <div className="partners flex flex-col gap-y-4 pt-10">
        <div className="relative flex flex-wrap items-center justify-center gap-x-20 gap-y-10">
          <img
            className="h-full w-auto object-contain"
            src="/partners/klub.png"
          />
          <img
            className="h-full w-auto object-contain"
            src="/partners/ki.png"
          />
          <img
            className="h-full w-auto object-contain"
            src="/partners/cosmos.png"
          />
          <img
            className="h-full w-auto object-contain"
            src="/partners/osmosis.png"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-20 gap-y-10">
          <img
            className="h-full w-auto object-cover"
            src="/partners/juno.png"
          />

          <img
            className="h-full w-auto object-cover"
            src="/partners/stargaze.png"
          />

          <img
            className="h-full w-auto object-cover"
            src="/partners/persistence.png"
          />

          <img
            className="h-full w-auto object-cover"
            src="/partners/akash.png"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-20 gap-y-10">
          <img
            className="h-full w-auto object-cover"
            src="/partners/sentinel.png"
          />
          <img
            className="h-full w-auto object-cover"
            src="/partners/comdex.png"
          />
          <img
            className="h-[41px] w-auto object-cover"
            src="/partners/lum-network.png"
          />
        </div>
      </div>
    </div>
  )
}
