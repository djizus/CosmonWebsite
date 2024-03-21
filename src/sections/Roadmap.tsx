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
            <RoadmapItem order={1} date="2024">
              Cosmon DAO takeover
            </RoadmapItem>
              <RoadmapItem order={2} date="Q2 2024">
                  <div>Improving website experience</div>
                  <div>Discord bot integration</div>
              </RoadmapItem>
              <RoadmapItem order={3} date="Q3 2024">
              <div>Improving gameplay</div>
                  <div>Adjusting rewards distribution</div>
              </RoadmapItem>
              <RoadmapItem order={4} date="Q4 2024">
                  <div>Making Cosmon a fairer experience</div>
              </RoadmapItem>
              <RoadmapItem order={5} date="2025">
                  <div>Expanding Cosmon</div>
              </RoadmapItem>
          </motion.div>
        </div>
      </div>
    </>
  )
}
