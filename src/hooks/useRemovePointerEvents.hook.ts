import { useEffect } from 'react'

export const useRemovePointerEvents = (isOpen: boolean) => {
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        document.getElementsByTagName('body')[0].style.pointerEvents = ''
      }, 300)
    }
  }, [isOpen])
}
