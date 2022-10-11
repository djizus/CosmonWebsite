import { AnimationType, UnmaskOnReachProps } from '@components/UnmaskOnReach/UnmaskOnReach.types'
import { HTMLMotionProps, motion } from 'framer-motion'

const UnmaskOnReach = ({
  children,
  animation = AnimationType.rise,
  delay = 0,
  className = '',
  reach = 0.75,
}: UnmaskOnReachProps) => {
  const defaultAnimStyle = () => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{
          delay,
          ease: [0.16, 1, 0.3, 1],
          duration: 2,
        }}
        viewport={{ once: true }}
      >
        {children}
      </motion.div>
    )
  }

  const riseAnimStyle = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: '50%' }}
        whileInView={{ opacity: 1, y: '0' }}
        transition={{
          delay,
          duration: 2,
          ease: [0.16, 1, 0.3, 1],
        }}
        viewport={{ once: true }}
      >
        {children}
      </motion.div>
    )
  }

  const AnimationStyle: any = {
    [AnimationType.default]: defaultAnimStyle,
    [AnimationType.rise]: riseAnimStyle,
  }

  return (
    <motion.div
      className={className}
      initial={{ overflow: 'hidden' }}
      animate={{
        overflow: 'hidden',
        transitionEnd: {
          overflow: 'visible',
        },
      }}
      transition={{
        delay: delay + 2,
        duration: 2,
        ease: 'linear',
      }}
    >
      {AnimationStyle[animation]()}
    </motion.div>
  )
}

export default UnmaskOnReach
