import Button from '../components/Button/Button'
import Image from 'next/image'
import router from 'next/router'
import { motion } from 'framer-motion'

export default function HoldAndEarn() {
  return (
    <>
      <div className="lg:mx-auto lg:flex lg:max-w-6xl lg:flex-row-reverse lg:items-center lg:justify-between">
        <motion.div
          initial={{ scale: 0.5 }}
          whileInView={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 250,
            damping: 15,
          }}
          viewport={{ once: true }}
          className="relative lg:w-1/2"
        >
          <Image
            layout="responsive"
            objectFit="contain"
            src="/hold-and-earn/cards-background.png"
            width="100%"
            height="100%"
          />
        </motion.div>

        <div className="lg:w-[44%] ">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.3,
            }}
            viewport={{ once: true }}
            className="mx-auto max-w-sm pt-10 lg:max-w-none lg:pt-0 lg:text-left"
          >
            Hold Cosmon, Earn $XKI
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.45,
              duration: 0.3,
            }}
            viewport={{ once: true }}
            className="pt-8 lg:pt-[40px] lg:pr-12 lg:text-left"
          >
            Cosmons holders will benefit of recurring $XKI return, providing to
            players a daily fuel to boost their Cosmon performance. The $XKI
            returns are increasing with the rarity levels of your Cosmons!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.6,
              duration: 0.3,
            }}
            viewport={{ once: true }}
            className="pt-10 lg:pt-[60px]"
          >
            <div className="relative flex flex-col items-center  gap-x-8 gap-y-5 lg:flex-row">
              {/* MVP  */}
              <Button
                type="disabled-colored"
                // onClick={
                //   () => router.push('/buy-cosmon')}
              >
                Buy Cosmon
              </Button>

              <div className="italic text-cosmon-main-tertiary">
                (Coming soon)
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
