import RoadmapItem from '../components/RoadmapItem/RoadmapItem'
import Line from '/public/roadmap/line.svg'
import RoadMapItemIllustration from '/public/roadmap/roadmap-item.svg'

export default function Roadmap() {
  return (
    <>
      <h2>Roadmap</h2>
      <p className="pt-4">How we are building the future of gaming</p>

      <div className="relative mx-auto flex h-full w-[300px] pt-5">
        <Line className="absolute left-7 h-full" />
        <div className="my-8 ml-2 flex flex-col gap-y-10">
          <RoadmapItem date="Q4 2021">Project Start</RoadmapItem>

          <RoadmapItem date="Q1 2022">
            <div>Private Sale</div>
            <div>Public Sale</div>
            <div>Stakedrop</div>
          </RoadmapItem>
          <RoadmapItem date="Q2 2022">
            <div>Accessories Launch</div>
            <div>Marketplace Listing</div>
          </RoadmapItem>
          <RoadmapItem date="Q2 2022">
            <div>Alpha 1st Season</div>
            <div>Build Your Deck</div>
          </RoadmapItem>
          <RoadmapItem date="Q3 2022">
            <div>Beta 1st Season</div>
          </RoadmapItem>
          <RoadmapItem date="Q4 2022">
            <div>Launch 1st Season</div>
          </RoadmapItem>
        </div>
      </div>
    </>
  )
}
