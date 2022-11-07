import clsx from 'clsx'
import { Boost } from 'types/Boost'
import * as style from './IconWithLabel.module.scss'

interface Props {
  label: string
  Icon: any
  className?: string
}

const IconWithLabel: React.FC<Props> = ({ Icon, label, className }) => {
  return (
    <div className={clsx(style.content, className)}>
      <Icon className={style.icon} />
      <span>{label}</span>
    </div>
  )
}

IconWithLabel.displayName = 'IconWithLabel'

export default IconWithLabel
