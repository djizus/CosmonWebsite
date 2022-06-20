type SectionProps = {
  children: React.ReactNode
  className?: string
  style?: any
}

export default function Section({
  children,
  className = '',
  style = {},
}: SectionProps) {
  return (
    <div style={style} className={`relative px-[30px] ${className}`}>
      {children}
    </div>
  )
}
