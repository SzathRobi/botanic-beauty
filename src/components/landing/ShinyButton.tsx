'use client'

import { type AnimationProps, motion } from 'framer-motion'

import { cn } from '@/lib/utils'

const animationProps = {
  initial: { '--x': '100%', scale: 0.8 },
  animate: { '--x': '-100%', scale: 1 },
  whileTap: { scale: 0.95 },
  transition: {
    repeat: Infinity,
    repeatType: 'loop',
    repeatDelay: 2,
    type: 'spring',
    stiffness: 20,
    damping: 15,
    mass: 2,
    scale: {
      type: 'spring',
      stiffness: 200,
      damping: 5,
      mass: 0.5,
    },
  },
} as AnimationProps

interface ShinyButtonProps {
  children: React.ReactNode
  className?: string
}

const ShinyButton = ({ children, className }: ShinyButtonProps) => {
  return (
    <motion.button
      {...animationProps}
      className={cn(
        'relative min-w-max rounded-lg border-2 border-emerald-500 bg-emerald-800 px-6 py-2 font-medium shadow-md shadow-black/30 backdrop-blur-xl transition-[box-shadow] duration-300 ease-in-out hover:border-emerald-600 hover:bg-emerald-900 hover:shadow-lg',
        className
      )}
    >
      <span
        className="relative block h-full w-full text-lg tracking-wide text-white"
        style={{
          maskImage:
            'linear-gradient(-75deg,rgba(16,185,129,1) calc(var(--x) + 20%),transparent calc(var(--x) + 30%),rgba(16,185,129,1) calc(var(--x) + 100%))',
        }}
      >
        {children}
      </span>
      <span
        style={{
          mask: 'linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box,linear-gradient(rgb(0,0,0), rgb(0,0,0))',
          maskComposite: 'exclude',
        }}
        className="absolute inset-0 z-10 block rounded-[inherit] bg-[linear-gradient(-75deg,rgba(16,185,129,0.2)_20%,rgba(16,185,129,0.6)_25%,rgba(16,185,129,0.2)_100%)] p-px"
      ></span>
    </motion.button>
  )
}

export default ShinyButton
