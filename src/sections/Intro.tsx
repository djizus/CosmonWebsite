import { motion } from 'framer-motion'

export default function Intro() {
  return (
    <>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Once upon a time...
      </motion.h2>
      <div className="mx-auto max-w-[637px] pt-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2,
          }}
          viewport={{ once: true }}
        >
          {' '}
          Earth 2500, there is no competent leader left to unite the
          multiplanetary human civilization against an imminent threat coming
          from space. In order to find a leader that could face this threat, a
          group of mad scientists on planet earth collected the DNA of all the
          most prominent conquerors and leaders of human history and worked
          relentlessly to clone them. <br /> <br />
          After having cloned them we ended up with thousands of clones and an
          urgent need to select the best ones.{' '}
        </motion.p>

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
          }}
          viewport={{ once: true }}
          className="pt-8 text-[22px] font-semibold leading-8"
        >
          Welcome to Cosmon!
        </motion.h3>
      </div>
    </>
  )
}
