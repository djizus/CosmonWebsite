import Image from 'next/image'

export default function Partners() {
  return (
    <div>
      <h2>Early supports and partners</h2>
      <p className="pt-[30px] text-lg leading-8">
        Cosmon is an in initiative from Klub and the Ki Foundation. We are
        working on some of the most promising Cosmos-based projects, including
        Cosmos Hub, Osmosis, Juno, Stargaze, Persistence, Akash, Sentinel,
        Comdex, and Lum. Playing to Cosmon will give you an exposition to these
        projects and to their underlying networks. More partners and supporters
        to come soon!
      </p>

      <div className="partner-list grid grid-cols-2 pt-10">
        <Image width="132px" height="64px" src="/partners/partner.svg" />
        <Image width="132px" height="64px" src="/partners/partner.svg" />
        <Image width="132px" height="64px" src="/partners/partner.svg" />
        <Image width="132px" height="64px" src="/partners/partner.svg" />
        <Image width="132px" height="64px" src="/partners/partner.svg" />
        <Image width="132px" height="64px" src="/partners/partner.svg" />
      </div>
    </div>
  )
}
