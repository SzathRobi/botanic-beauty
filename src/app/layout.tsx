import './globals.css'

import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#222222',
}

// TODO: check whats 'verification' prop does
export const metadata: Metadata = {
  metadataBase: new URL('https://www.botanic-beauty.hu'),
  openGraph: {
    siteName: 'Botanic Beauty',
    type: 'website',
    locale: 'hu_HU',
    images: [
      {
        url: 'https://www.botanic-beauty.hu/logo-google-square.png',
        width: 1200,
        height: 1200,
        alt: 'Botanic Beauty Logo',
      },
      {
        url: 'https://www.botanic-beauty.hu/logo-google-wide.png',
        width: 1200,
        height: 630,
        alt: 'Botanic Beauty Logo',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    googleBot: 'index, follow',
  },
  applicationName: 'Botanic Beauty',
  appleWebApp: {
    title: 'Botanic Beauty Hajszalon',
    statusBarStyle: 'default',
    capable: true,
  },
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        type: 'image/x-icon',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/favicon-96x96.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/android-chrome-256x256.png',
        sizes: '256x256',
        type: 'image/png',
      },
    ],

    shortcut: [
      {
        url: '/favicon.ico',
        type: 'image/x-icon',
      },
    ],
    apple: [
      {
        url: '/apple-icon-57x57.png',
        sizes: '57x57',
        type: 'image/png',
      },
      {
        url: '/apple-icon-60x60.png',
        sizes: '60x60',
        type: 'image/png',
      },
      {
        url: '/apple-icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
      },
      {
        url: '/apple-icon-76x76.png',
        sizes: '76x76',
        type: 'image/png',
      },
      {
        url: '/apple-icon-114x114.png',
        sizes: '114x114',
        type: 'image/png',
      },
      {
        url: '/apple-icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
      },
      {
        url: '/apple-icon-180x180.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="hu">
      <body className={`${inter.className} bg-[#0F1E14]`}>
        <Header />
        <Toaster />
        <div>{children}</div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'HairSalon',
              name: 'Botanic Beauty',
              image:
                'https://github.com/SzathRobi/botanic-beauty/blob/main/public/logo-with-bg.png?raw=true',
              '@id': 'https://www.botanic-beauty.hu',
              url: 'https://www.botanic-beauty.hu',
              telephone: '',
              priceRange: '2000Ft - 30000Ft',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Széchenyi tér 4a.',
                addressLocality: 'Budapest',
                postalCode: '1045',
                addressCountry: 'HU',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 47.55284,
                longitude: 19.09547,
              },
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: [
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                ],
                opens: '10:00',
                closes: '19:00',
              },
            }),
          }}
        />
      </body>
    </html>
  )
}
