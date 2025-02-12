import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const defaultPages: MetadataRoute.Sitemap = [
    {
      url: 'https://www.botanic-beauty.hu',
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: 'https://www.botanic-beauty.hu/arlista',
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: 'https://www.botanic-beauty.hu/idopontfoglalas',
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.botanic-beauty.hu/munkaink',
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://www.botanic-beauty.hu/szolgaltatasaink',
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  ]

  const sitemap = [...defaultPages]

  return sitemap
}
