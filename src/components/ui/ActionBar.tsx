import { ReactNode } from 'react'

type ActionBarProps = {
  children: ReactNode
}

const ActionBar = ({ children }: ActionBarProps) => {
  return (
    <div className="mb-8 flex flex-col-reverse gap-2 md:flex-row md:items-center">
      {children}
    </div>
  )
}

export default ActionBar
