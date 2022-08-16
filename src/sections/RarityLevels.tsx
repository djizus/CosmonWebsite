import RarityLevel from '../components/RarityLevel/RarityLevel'
import { motion } from 'framer-motion'
import { SCARCITIES } from 'types/Scarcity'

export default function RarityLevels() {
  const rarityListAnimation = {
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.095,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        when: 'afterChildren',
      },
    },
  }
  const rarityItemAnimation = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 20 },
  }
  return (
    <>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.3,
        }}
        viewport={{ once: true }}
        className="text-[40px]"
      >
        Six rarity levels
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.45,
          duration: 0.3,
        }}
        viewport={{ once: true }}
        className="mx-auto max-w-[750px] pt-4"
      >
        And so many opportunities to evolve. Start the adventure with a common,
        climb the levels with him as you win, and finish with a Divinity. Lead
        your battles to victory and become the greatest war hero incarnate in
        the entire universe.
      </motion.p>

      <motion.div
        initial="hidden"
        whileInView={'visible'}
        variants={rarityListAnimation}
        viewport={{ once: true }}
        className="rarity-levels flex flex-col items-center gap-y-9  gap-x-[45px] pt-6 lg:flex-row lg:items-start lg:justify-center lg:pt-[123px] xl:gap-x-[60px]"
      >
        <motion.div variants={rarityItemAnimation}>
          <RarityLevel type={SCARCITIES.COMMON} />
        </motion.div>

        <motion.div variants={rarityItemAnimation}>
          <RarityLevel type={SCARCITIES.UNCOMMON} />
        </motion.div>
        <motion.div variants={rarityItemAnimation}>
          <RarityLevel type={SCARCITIES.RARE} />
        </motion.div>
        <motion.div variants={rarityItemAnimation}>
          <RarityLevel type={SCARCITIES.EPIC} />
        </motion.div>
        <motion.div variants={rarityItemAnimation}>
          <RarityLevel type={SCARCITIES.LEGENDARY} />
        </motion.div>
        <motion.div variants={rarityItemAnimation}>
          <RarityLevel comingSoon type={SCARCITIES.DIVINITY} />
        </motion.div>
      </motion.div>
    </>
  )
}
