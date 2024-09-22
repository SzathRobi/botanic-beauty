'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

type TransitionProps = {
  children: ReactNode
}

export default function Transition({ children }: TransitionProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: 'easeInOut', duration: 0.75 }}
    >
      {children}
    </motion.div>
  )
}
