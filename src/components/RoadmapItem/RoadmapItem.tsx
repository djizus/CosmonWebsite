import RoadMapItemIllustration from '/public/roadmap/roadmap-item.svg'

export type RoadmapItemType = {
  date: string
  children: React.ReactNode
  order: number
}

export default function RoadmapItem({
  date,
  children,
  order,
}: RoadmapItemType) {
  return (
    <div
      className={`flex items-center gap-x-11 lg:-mt-[70px] lg:inline-flex lg:h-full lg:flex-col ${
        order % 2 === 1 ? 'lg:-mt-[70px] lg:flex-col-reverse' : 'lg:mt-[190px]'
      }`}
    >
      <RoadMapItemIllustration
        className={`h-10 w-10 lg:absolute lg:top-[94px] lg:h-[90px] lg:w-[90px] ${
          order % 2 === 1 ? '' : ''
        }`}
      />
      <div className="flex w-[178px] flex-col items-center justify-center rounded-xl bg-[#443E78] bg-opacity-40 py-3 px-5 text-white">
        <div className="text-[16px] leading-[26px]">{date}</div>
        <div className="text-sm leading-6">{children}</div>
      </div>
    </div>
  )
}
