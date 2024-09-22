import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const defaultPages: MetadataRoute.Sitemap = [
    {
      url: 'https://botanic-beauty.hu',
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: 'https://botanic-beauty.hu/arlista',
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: 'https://botanic-beauty.hu/idopontfoglalas',
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://botanic-beauty.hu/munkaink',
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://botanic-beauty.hu/adatvedelmi-nyilatkozat',
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.1,
    },
    {
      url: 'https://botanic-beauty.hu/felhasznalasi-feltetelek',
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.1,
    },
  ]

  const sitemap = [...defaultPages]

  return sitemap
}
