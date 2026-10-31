import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import { Button } from './Button'

type PageProps = {
  children: React.ReactNode
  title?: string
  description?: string
  isTextCentered?: boolean
  hasBackLink?: boolean
  hasTitleLeftMarginOnMobile?: boolean
  backLinkUrl?: string
  className?: string
}

export function Page({
  children,
  title,
  description,
  isTextCentered,
  backLinkUrl,
  hasBackLink,
  hasTitleLeftMarginOnMobile,
  className,
}: PageProps) {
  return (
    <div
      className={cn(
        'max-w-8xl mx-auto w-full px-4 py-4 text-foreground sm:px-6 md:py-8 lg:px-8',
        className
      )}
    >
      {hasBackLink && backLinkUrl && (
        <Link href={backLinkUrl}>
          <Button variant="ghost" className="mb-4 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Vissza
          </Button>
        </Link>
      )}

      {title && (
        <h1
          className={cn(
            'mb-4 text-3xl font-bold tracking-tight sm:text-4xl',
            isTextCentered && 'text-center',
            hasTitleLeftMarginOnMobile && 'ml-4 sm:ml-0'
          )}
        >
          {title}
        </h1>
      )}
      {description && (
        <p
          className={cn(
            'mb-12 max-w-2xl text-base text-muted-foreground sm:text-lg',
            isTextCentered && 'mx-auto text-center'
          )}
        >
          {description}
        </p>
      )}

      {children}
    </div>
  )
}
