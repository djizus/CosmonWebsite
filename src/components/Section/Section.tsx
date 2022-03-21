type SectionProps = {
  children: React.ReactNode
  className?: string
}

export default function Section({ children, className = '' }: SectionProps) {
  return <div className={`relative px-[30px] ${className}`}>{children}</div>
}
