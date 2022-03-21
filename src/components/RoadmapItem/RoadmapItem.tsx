import RoadMapItemIllustration from '/public/roadmap/roadmap-item.svg'

export type RoadmapItemType = {
  date: string
  children: React.ReactNode
}

export default function RoadmapItem({ date, children }: RoadmapItemType) {
  return (
    <div className="flex items-center gap-x-11">
      <RoadMapItemIllustration className="" />
      <div className="flex w-[178px] flex-col items-center justify-center rounded-xl bg-[#443E78] bg-opacity-40 py-3 px-5 text-white">
        <div className="text-[16px] leading-[26px]">{date}</div>
        <div className="text-sm leading-6">{children}</div>
      </div>
    </div>
  )
}
