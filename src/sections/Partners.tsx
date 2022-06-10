import { motion } from 'framer-motion'

export default function Partners() {
  const partnerListAnimation = {
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.07,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        when: 'afterChildren',
      },
    },
  }
  const partnerItemAnimation = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 20 },
  }
  return (
    <div className="mx-auto max-w-6xl">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.3,
        }}
        viewport={{ once: true }}
      >
        Early supports and partners
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.45,
          duration: 0.3,
        }}
        viewport={{ once: true }}
        className="mx-auto max-w-[860px] pt-[30px] text-lg leading-8"
      >
        Cosmon is an in initiative from Klub and the Ki Foundation. We are
        working on some of the most promising Cosmos-based projects, including
        Cosmos Hub, Osmosis, Juno, Stargaze, Persistence, Akash, Sentinel,
        Comdex, and Lum. Playing to Cosmon will give you an exposition to these
        projects and to their underlying networks. More partners and supporters
        to come soon!
      </motion.p>

      <motion.div
        initial="hidden"
        whileInView={'visible'}
        variants={partnerListAnimation}
        className="partners flex flex-col gap-y-4 pt-10"
        viewport={{ once: true }}
      >
        <div className="relative flex flex-wrap items-center justify-center gap-x-20 gap-y-10">
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

        <div className="flex flex-wrap items-center justify-center gap-x-20 gap-y-10">
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

        <div className="flex flex-wrap items-center justify-center gap-x-20 gap-y-10">
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
      </motion.div>
    </div>
  )
}
