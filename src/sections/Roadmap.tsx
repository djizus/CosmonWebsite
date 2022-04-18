import RoadmapItem from '../components/RoadmapItem/RoadmapItem'
import Line from '/public/roadmap/line.svg'
import LineDesktop from '/public/roadmap/line-desktop.svg'
import RoadMapItemIllustration from '/public/roadmap/roadmap-item.svg'

export default function Roadmap() {
  return (
    <>
      <h2>Roadmap</h2>
      <p className="pt-4">How we are building the future of gaming</p>

      <div className="relative mx-auto flex h-full w-[300px] pt-5 lg:w-auto">
        <Line className="absolute left-7 h-full lg:hidden" />
        <div className="lg:relative lg:mx-auto lg:mt-32 ">
          <LineDesktop className="absolute top-[140px] z-0 -ml-[100px] hidden h-1 w-[calc(100%_+_200px)] lg:block" />
          <div className="my-8 ml-2 flex flex-col gap-y-10 lg:flex-row">
            <RoadmapItem order={1} date="Q4 2021">
              Project Start
            </RoadmapItem>

            <RoadmapItem order={2} date="Q1 2022">
              <div>Private Sale</div>
              <div>Public Sale</div>
              <div>Stakedrop</div>
            </RoadmapItem>
            <RoadmapItem order={3} date="Q2 2022">
              <div>Accessories Launch</div>
              <div>Marketplace Listing</div>
            </RoadmapItem>
            <RoadmapItem order={4} date="Q2 2022">
              <div>Alpha 1st Season</div>
              <div>Build Your Deck</div>
            </RoadmapItem>
            <RoadmapItem order={5} date="Q3 2022">
              <div>Beta 1st Season</div>
            </RoadmapItem>
            <RoadmapItem order={6} date="Q4 2022">
              <div>Launch 1st Season</div>
            </RoadmapItem>
          </div>
        </div>
      </div>
    </>
  )
}
