'use client'

import {
  Album,
  CalendarDays,
  ChartColumnDecreasing,
  Ellipsis,
  ImageUp,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/Dropdown'

const navElements = [
  {
    title: 'Beosztás',
    href: '/admin/beosztas',
    icon: <CalendarDays className="mx-auto mb-1" />,
  },
  {
    title: 'Foglalások',
    href: '/admin/foglalasok',
    icon: <Album className="mx-auto mb-1" />,
  },
  {
    title: 'Ügyfelek',
    href: '/admin/ugyfelek',
    icon: <Users className="mx-auto mb-1" />,
  },
  {
    title: 'Képfeltöltés',
    href: '/admin/kepfeltoltes',
    icon: <ImageUp className="mx-auto mb-1" />,
  },
  {
    title: 'Analitika',
    href: '/admin/analitika',
    icon: <ChartColumnDecreasing className="mx-auto mb-1" />,
  },
]

const navElementsMobile = [
  {
    title: 'Beosztás',
    href: '/admin/beosztas',
    icon: <CalendarDays className="mx-auto mb-1" />,
  },
  {
    title: 'Foglalások',
    href: '/admin/foglalasok',
    icon: <Album className="mx-auto mb-1" />,
  },
  {
    title: 'Ügyfelek',
    href: '/admin/ugyfelek',
    icon: <Users className="mx-auto mb-1" />,
  },
  {
    component: (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Ellipsis />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="dark">
          <DropdownMenuItem>
            <Link
              href="/admin/kepfeltoltes"
              className="px-1 py-2 text-center text-xs hover:bg-green-500/20 sm:px-4 md:w-full md:text-base"
            >
              <ImageUp />
              Képfeltöltés
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link
              href="/admin/analitika"
              className="px-1 py-2 text-center text-xs hover:bg-green-500/20 sm:px-4 md:w-full md:text-base"
            >
              <ChartColumnDecreasing />
              Analitika
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

const AdminNavList = () => {
  const pathName = usePathname()

  return (
    <div className="h-full text-white">
      <ul className="flex h-full items-start gap-2 bg-emerald-800 px-2 md:hidden md:flex-col md:gap-4 md:pt-24">
        {navElementsMobile.map((element, index) =>
          element.component ? (
            <li
              key={index}
              className="my-auto flex min-w-12 items-center justify-center rounded-md md:w-full md:flex-none"
            >
              {element.component}
            </li>
          ) : (
            <li
              key={element.title}
              className={`${
                pathName === element.href && 'bg-emerald-900'
              } flex flex-1 items-center justify-center rounded-md md:w-full md:flex-none`}
            >
              <Link
                href={element.href}
                className="px-1 py-2 text-center text-xs hover:bg-green-500/20 sm:px-4 md:w-full md:text-base"
              >
                {element.icon}
                {element.title}
              </Link>
            </li>
          )
        )}
      </ul>

      <ul className="hidden h-full items-start gap-2 bg-emerald-800 px-2 md:flex md:flex-col md:gap-4 md:pt-24">
        {navElements.map((element) => (
          <li
            key={element.title}
            className={`${
              pathName === element.href && 'bg-emerald-900'
            } flex flex-1 items-center justify-center rounded-md md:w-full md:flex-none`}
          >
            <Link
              href={element.href}
              className="px-1 py-2 text-center text-xs hover:bg-green-500/20 sm:px-4 md:w-full md:text-base"
            >
              {element.icon}
              {element.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdminNavList
