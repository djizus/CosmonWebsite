import { motion } from 'framer-motion'

export default function PartnerLogos() {
  const partnerItemAnimation = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 20 },
  }
  return (
    <>
      <div className="relative hidden flex-wrap items-center justify-center gap-x-20 gap-y-10 lg:flex ">
        <motion.img
          variants={partnerItemAnimation}
          className="h-full w-auto object-contain"
          src="/partners/klub.png"
        />
        <motion.img
          variants={partnerItemAnimation}
          className="h-full w-auto object-contain"
          src="/partners/ki.png"
        />
        <motion.img
          variants={partnerItemAnimation}
          className="h-full w-auto object-contain"
          src="/partners/cosmos.png"
        />
        <motion.img
          variants={partnerItemAnimation}
          className="h-full w-auto object-contain"
          src="/partners/osmosis.png"
        />
      </div>

      <div className="hidden flex-wrap items-center justify-center gap-x-20 gap-y-10 lg:flex">
        <motion.img
          variants={partnerItemAnimation}
          className="h-full w-auto object-cover"
          src="/partners/juno.png"
        />

        <motion.img
          variants={partnerItemAnimation}
          className="h-full w-auto object-cover"
          src="/partners/stargaze.png"
        />

        <motion.img
          variants={partnerItemAnimation}
          className="h-full w-auto object-cover"
          src="/partners/persistence.png"
        />

        <motion.img
          variants={partnerItemAnimation}
          className="h-full w-auto object-cover"
          src="/partners/akash.png"
        />
      </div>

      <div className="hidden flex-wrap items-center justify-center gap-x-20 gap-y-10 lg:flex">
        <motion.img
          variants={partnerItemAnimation}
          className="h-full w-auto object-cover"
          src="/partners/sentinel.png"
        />
        <motion.img
          variants={partnerItemAnimation}
          className="h-full w-auto object-cover"
          src="/partners/comdex.png"
        />
        <motion.img
          variants={partnerItemAnimation}
          className="h-full w-auto object-cover lg:h-[41px]"
          src="/partners/lum-network.png"
        />
      </div>

      <div className="flex w-full flex-col items-center gap-y-8 px-6 sm:px-10 lg:hidden">
        <div className="flex w-full items-center justify-around">
          <motion.img
            variants={partnerItemAnimation}
            className="h-6 w-auto object-contain"
            src="/partners/klub.png"
          />
          <motion.img
            variants={partnerItemAnimation}
            className="h-full w-auto object-contain"
            src="/partners/ki.png"
          />
        </div>
        <div className="flex w-full items-center justify-around">
          <motion.img
            variants={partnerItemAnimation}
            className="h-full w-auto object-contain"
            src="/partners/cosmos.png"
          />
          <motion.img
            variants={partnerItemAnimation}
            className="h-full w-auto object-contain"
            src="/partners/osmosis.png"
          />
        </div>
        <div className="flex w-full items-center justify-around">
          <motion.img
            variants={partnerItemAnimation}
            className="h-full w-auto object-cover"
            src="/partners/juno.png"
          />

          <motion.img
            variants={partnerItemAnimation}
            className="h-full w-auto object-cover"
            src="/partners/stargaze.png"
          />
        </div>
        <div className="flex w-full items-center justify-around">
          <motion.img
            variants={partnerItemAnimation}
            className="h-full w-auto object-cover"
            src="/partners/persistence.png"
          />

          <motion.img
            variants={partnerItemAnimation}
            className="h-full w-auto object-cover"
            src="/partners/akash.png"
          />
        </div>

        <div className="flex w-full items-center justify-around">
          <motion.img
            variants={partnerItemAnimation}
            className="h-full w-auto object-cover"
            src="/partners/sentinel.png"
          />
          <motion.img
            variants={partnerItemAnimation}
            className="h-full w-auto object-cover"
            src="/partners/comdex.png"
          />
        </div>
        <div className="flex w-full items-center justify-around">
          <motion.img
            variants={partnerItemAnimation}
            className="h-full w-auto object-cover lg:h-[41px]"
            src="/partners/lum-network.png"
          />
        </div>
      </div>
    </>
  )
}
