import Image from 'next/image'
import router from 'next/router'
import Button from '../components/Button/Button'
import ChooseYourLeadersBackground from '/public/choose-your-leaders/town.png'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function ChooseYourLeaders() {
  const { ref, inView, entry } = useInView({ triggerOnce: true })
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
          className="flex flex-col items-center justify-center gap-y-5 pt-8 lg:pt-16"
        >
          {/* MVP - Button disabled */}
          {/* <div className="absolute left-0 z-50 h-full w-full"></div> */}
          <Button type="primary" onClick={() => router.push('/buy-cosmon')}>
            Buy cosmon
          </Button>
          {/* <div className="italic text-cosmon-main-tertiary">(Coming soon)</div> */}
        </motion.div>
      </div>

      <div
        className={`absolute -bottom-40 left-0 flex w-full  justify-center overflow-hidden transition-transform duration-700 ease-out lg:bottom-[102px] lg:justify-start lg:pl-[220px]`}
      >
        <>
          <motion.div
            initial={{ x: '-100vw' }}
            // whileInView={{ opacity: 1, x: '0%' }}
            animate={
              inView && {
                x: '0%',
              }
            }
            transition={{
              type: 'spring',
              delay: 0.4,
              duration: 1,
            }}
            className="relative mb-20 w-[164px]"
          >
            <Image
              layout="fill"
              className="object-contain"
              src={'/choose-your-leaders/leaders/resized/leader-1-animated.gif'}
            />
          </motion.div>
          <motion.div
            initial={{ x: '-100vw' }}
            // whileInView={{ opacity: 1, x: '0%' }}
            animate={
              inView && {
                x: '0%',
              }
            }
            transition={{
              type: 'spring',
              delay: 0.2,
              duration: 1,
            }}
            className="relative mx-5 mt-20 h-[220px] w-[120px] lg:ml-[100px] lg:mr-[66px]"
          >
            <Image
              priority={true}
              layout="fill"
              className="object-contain"
              src={'/choose-your-leaders/leaders/resized/leader-2-animated.gif'}
            />
          </motion.div>
          <motion.div
            initial={{ x: '-100vw' }}
            // whileInView={{ opacity: 1, x: '0%' }}
            animate={
              inView && {
                x: '0%',
              }
            }
            transition={{
              type: 'spring',
              delay: 0,
              duration: 1,
            }}
            className="relative h-[216px] w-[95px]"
          >
            <Image
              priority={true}
              layout="fill"
              className="object-contain"
              src={'/choose-your-leaders/leaders/resized/leader-3-animated.gif'}
            />
          </motion.div>
        </>
      </div>

      <motion.div
        className={`absolute -bottom-24 left-0 hidden w-full  justify-center overflow-hidden pt-16 transition-transform delay-300 duration-700 ease-out lg:left-[480px] lg:bottom-[245px] lg:flex lg:w-full xl:left-[410px]`}
      >
        <>
          <motion.div
            initial={{ x: '100vw' }}
            // whileInView={{ opacity: 1, x: '0%' }}
            animate={
              inView && {
                x: '0%',
              }
            }
            transition={{
              type: 'spring',
              delay: 0.8,
              duration: 1,
            }}
            className="relative h-[209px] w-[105px]"
          >
            <Image
              layout="fill"
              className="object-cover"
              src={'/choose-your-leaders/leaders/resized/leader-4-animated.gif'}
            />
          </motion.div>
          <motion.div
            initial={{ x: '100vw' }}
            // whileInView={{ opacity: 1, x: '0%' }}
            animate={
              inView && {
                x: '0%',
              }
            }
            transition={{
              type: 'spring',
              delay: 1,
              duration: 1,
            }}
            className="relative mx-5 mt-16 h-[199px] w-[114px] lg:mx-16"
          >
            <Image
              layout="fill"
              className="object-cover"
              src={'/choose-your-leaders/leaders/resized/leader-5-animated.gif'}
            />
          </motion.div>
          <motion.div
            initial={{ x: '100vw' }}
            // whileInView={{ opacity: 1, x: '0%' }}
            animate={
              inView && {
                x: '0%',
              }
            }
            transition={{
              delay: 1.2,
              type: 'spring',
              duration: 1,
            }}
            className="relative -mt-8 h-[193px] w-[107px]"
          >
            <div className="absolute h-full w-full">
              <Image
                layout="fill"
                className="object-cover"
                src={
                  '/choose-your-leaders/leaders/resized/leader-6-animated.gif'
                }
              />
            </div>
          </motion.div>
        </>
      </motion.div>

      <div ref={ref} className="absolute bottom-40"></div>
    </>
  )
}
