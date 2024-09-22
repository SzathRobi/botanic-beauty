'use client'

import { isMobile } from 'react-device-detect'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'

type DndContextProps = {
  children: React.ReactNode
}

const DnDContext = ({ children }: DndContextProps) => {
  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      {children}
    </DndProvider>
  )
}

export default DnDContext
