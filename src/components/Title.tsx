import { HTMLAttributes } from 'react'

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  title: string
}

const Title = ({ title, className, ...props }: TitleProps) => {
  return (
    <h2
      className={`mx-auto w-fit min-w-[300px] rounded-xl border-2 border-white/15 bg-black/60 px-12 py-4 text-center text-2xl text-white shadow-md backdrop-blur-xl ${className} mb-14 md:mb-28`}
      {...props}
    >
      {title}
    </h2>
  )
}

export default Title
