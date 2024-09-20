import { HTMLAttributes, ReactNode } from 'react'

interface BackgroundBlurProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

const BackgroundBlur = ({
  children,
  className,
  ...props
}: BackgroundBlurProps) => {
  return (
    <div
      className={`w-full max-w-md rounded-2xl border-2 border-white/15 bg-black/60 px-4 py-8 text-white shadow-md backdrop-blur-md sm:max-w-2xl sm:p-10 md:max-w-3xl md:p-12 lg:max-w-5xl ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default BackgroundBlur
