import RoadmapItem from '../components/RoadmapItem/RoadmapItem'
import Line from '/public/roadmap/line.svg'
import LineDesktop from '/public/roadmap/line-desktop.svg'
import { motion } from 'framer-motion'

export default function Roadmap() {
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
      >
        Roadmap
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.45,
          duration: 0.3,
        }}
        className="pt-4"
        viewport={{ once: true }}
      >
        How we are building the future of gaming
      </motion.p>

      <div className="relative mx-auto flex h-full w-[300px] pt-5 lg:w-auto">
        <Line className="absolute left-7 h-full lg:hidden" />
        <div className="lg:relative lg:mx-auto lg:mt-32 ">
          <LineDesktop className="absolute top-[140px] z-0 -ml-[100px] hidden h-1 w-[calc(100%_+_200px)] lg:block" />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{
              delay: 0.5,
              duration: 0.5,
            }}
            viewport={{ once: true }}
            className="my-8 ml-2 flex flex-col gap-y-10 lg:flex-row"
          >
            <RoadmapItem order={1} date="Q4 2021">
              Project Start
            </RoadmapItem>
            <RoadmapItem order={2} date="Q1 2022">
              <div>White paper formalization</div>
              <div>1st private sale</div>
            </RoadmapItem>
            <RoadmapItem order={3} date="Q2 2022">
              <div>2nd private sale</div>
              <div>Public sale launch</div>
              <div>Stakedrop</div>
            </RoadmapItem>
            <RoadmapItem order={4} date="Q3 2022">
              <div> Gameplay MVP</div>
              <div> Build your deck</div>
              <div>Cosmon training mode</div>
            </RoadmapItem>
            <RoadmapItem order={5} date="Q4 2022">
              <div>Alpha 1st season</div>
              <div>Leagues and prize pools</div>
              <div>Boost and fighting bonuses</div>
            </RoadmapItem>
            <RoadmapItem order={6} date="2023">
              <div>Full gameplay final release</div>
              <div>Launch of pro leagues</div>
              <div>Secondary market place</div>
            </RoadmapItem>
          </motion.div>
        </div>
      </div>
    </>
  )
}
