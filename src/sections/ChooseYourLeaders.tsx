import Image from 'next/image'
import router from 'next/router'
import Button from '../components/Button/Button'
import ChooseYourLeadersBackground from '/public/choose-your-leaders/town.png'
import { motion } from 'framer-motion'

export default function ChooseYourLeaders() {
  // const { ref, inView, entry } = useInView({ triggerOnce: true })
  // const LeadersIllustration = () => (

  // )

  return (
    <>
      <div className="absolute top-[160px] left-0 z-0 h-full w-full lg:top-0">
        <div
          style={{
            background:
              'linear-gradient(180deg, #09082D 0%, rgba(9, 8, 45, 0.1) 100%)',
          }}
          className="absolute z-10 h-full w-full"
        ></div>

        <Image
          layout="fill"
          src={ChooseYourLeadersBackground}
          objectPosition="0% 80%"
          objectFit="cover"
          quality={75}
        />
      </div>
      <div className="relative mx-auto -mt-28 max-w-[598px]">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
          }}
          viewport={{ once: true }}
        >
          Choose your Leaders
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.4,
          }}
          viewport={{ once: true }}
          className="pt-6"
        >
          On the eve of the greatest battle in history, build your deck with the
          best conquerors and leaders of all time. Different personalities and
          strengths with one common goal: to win that war.{' '}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5,
          }}
          viewport={{ once: true }}
          className="flex justify-center pt-8 lg:pt-16"
        >
          <Button onClick={() => router.push('/buy-cosmon')}>Buy cosmon</Button>
        </motion.div>
      </div>

      <div
        className={`absolute -bottom-40 left-0 flex w-full  justify-center overflow-hidden transition-transform duration-700 ease-out lg:bottom-[80px] lg:justify-start lg:pl-[280px]`}
      >
        <>
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            whileInView={{ opacity: 1, x: '0%' }}
            viewport={{ once: true }}
            transition={{
              delay: 0.4,
              type: 'spring',
              stiffness: 260,
              damping: 15,
            }}
            // viewport={{ once: true }}
            className="relative h-[203px] w-[106px]"
          >
            <Image
              layout="fill"
              className="object-cover"
              src={'/choose-your-leaders/leaders/leader-1.png'}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            whileInView={{ opacity: 1, x: '0%' }}
            viewport={{ once: true }}
            transition={{
              delay: 0.5,
              type: 'spring',
              stiffness: 260,
              damping: 15,
            }}
            className="relative mx-5 mt-12 h-[266px] w-[109px] lg:ml-[100px] lg:mr-[56px]"
          >
            <Image
              layout="fill"
              className="object-cover"
              src={'/choose-your-leaders/leaders/leader-2.png'}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            whileInView={{ opacity: 1, x: '0%' }}
            viewport={{ once: true }}
            transition={{
              delay: 0.6,
              type: 'spring',
              stiffness: 280,
              damping: 15,
            }}
            className="relative h-[216px] w-[95px]"
          >
            <Image
              layout="fill"
              className="object-cover"
              src={'/choose-your-leaders/leaders/leader-3.png'}
            />
          </motion.div>
        </>
      </div>

      <div
        className={`absolute -bottom-24 left-0 hidden w-full  justify-center overflow-hidden pt-16 transition-transform delay-300 duration-700 ease-out lg:left-[440px] lg:bottom-[245px] lg:flex lg:w-full xl:left-[410px]`}
      >
        <>
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            whileInView={{ opacity: 1, x: '0%' }}
            viewport={{ once: true }}
            transition={{
              delay: 0.8,
              type: 'spring',
              stiffness: 260,
              damping: 15,
            }}
            className="relative h-[209px] w-[105px]"
          >
            <Image
              layout="fill"
              className="object-cover"
              src={'/choose-your-leaders/leaders/leader-4.png'}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            whileInView={{ opacity: 1, x: '0%' }}
            viewport={{ once: true }}
            transition={{
              delay: 0.9,
              type: 'spring',
              stiffness: 260,
              damping: 15,
            }}
            className="relative mx-5 mt-16 h-[199px] w-[114px] lg:mx-16"
          >
            <Image
              layout="fill"
              className="object-cover"
              src={'/choose-your-leaders/leaders/leader-5.png'}
            />
          </motion.div>
          <div className="relative -mt-8 h-[193px] w-[97px]">
            <motion.div
              viewport={{ once: true }}
              initial={{ opacity: 0, x: '100%' }}
              whileInView={{ opacity: 1, x: '0%' }}
              transition={{
                delay: 1,
                type: 'spring',
                stiffness: 260,
                damping: 15,
              }}
              className="absolute h-full w-full"
            >
              <Image
                layout="fill"
                className="object-cover"
                src={'/choose-your-leaders/leaders/leader-6.png'}
              />
            </motion.div>
          </div>
        </>
      </div>

      {/* <div ref={ref} className="absolute bottom-0"></div> */}
    </>
  )
}
