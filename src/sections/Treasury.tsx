import Button from '../components/Button/Button'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Treasury() {
  return (
    <div className="mx-auto items-center justify-between lg:flex lg:max-w-6xl">
      <div>
        <motion.div
          initial={{ scale: 0.5 }}
          whileInView={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 250,
            damping: 15,
          }}
          viewport={{ once: true }}
          className="-ml-[50px] w-[calc(100%_+_100px)] lg:-ml-44 lg:-mr-10 lg:w-[720px]"
        >
          <Image
            objectFit="cover"
            layout="responsive"
            src="treasury/treasury-managment-illustration.png"
            width="100%"
            height="100%"
          />
        </motion.div>
      </div>
      <div className="lg:ml-6 ">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.3,
          }}
          viewport={{ once: true }}
          className="lg:text-left"
        >
          Treasury management
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.4,
            duration: 0.3,
          }}
          viewport={{ once: true }}
          className="pt-10 lg:max-w-xl lg:text-left"
        >
          All the proceeds of the NFT sales will be pooled in a decentralized
          treasury to get an exposure to the most promising Cosmos-based tokens.
          These assets will be used to secure the associated networks, fueling
          the $XKI returns thanks to the inflation of targeted protocols.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.55,
            duration: 0.3,
          }}
          viewport={{ once: true }}
          className="pt-4 lg:text-left"
        >
          This unique approach is at the origin of the key tokenomics dimension
          of Cosmon:{' '}
        </motion.p>

        <ul className="flex flex-col gap-y-6 px-6 pt-4  text-center lg:ml-2 lg:text-left">
          <motion.li
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.7,
              duration: 0.3,
            }}
            viewport={{ once: true }}
            className="list-disc"
          >
            {/* <li className="list-disc text-[8px]"> */}
            {/* <div className="text-base"> */} Bring a growing fundamental
            value to the Cosmons NFTs
            {/* </div> */}
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.8,
              duration: 0.3,
            }}
            viewport={{ once: true }}
            className="list-disc"
          >
            Provide recurring $XKI returns to their holders to be used ingame
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.9,
              duration: 0.3,
            }}
            viewport={{ once: true }}
            className="list-disc"
          >
            Fuel the prize pools of the different leagues
          </motion.li>
        </ul>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1,
            duration: 0.3,
          }}
          viewport={{ once: true }}
          className="pt-[60px]"
        >
          <Button
            type="secondary"
            icon={{
              position: 'left',
              direction: 'right',
            }}
            onClick={() =>
              window.open(
                `https://inky-sidewalk-879.notion.site/Cosmon-white-paper-722dc48d832a49e9ae348eaf94184706`,
                '_blank'
              )
            }
          >
            Learn more
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
