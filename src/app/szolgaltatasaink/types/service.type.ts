import { StaticImageData } from 'next/image'

export type Service = {
  duration: number
  name: string
  shortDescription: string
  longDescription: string
  image: StaticImageData
  queryParam: string
}
