'use client'
import type { Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import type { HTMLAttributes } from 'react'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
interface DataTableColumnHeaderProps<
  TData,
  TValue,
> extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) return <div className={cn(className)}>{title}</div>
  const direction = column.getIsSorted(),
    Icon =
      direction === 'asc'
        ? ArrowUp
        : direction === 'desc'
          ? ArrowDown
          : ArrowUpDown
  return (
    <Button
      type="button"
      variant="ghost"
      className={cn('-ml-3 gap-2 px-3', className)}
      aria-label={`${title} rendezése${direction === 'asc' ? ', jelenleg növekvő' : direction === 'desc' ? ', jelenleg csökkenő' : ''}`}
      onClick={column.getToggleSortingHandler()}
    >
      {title}
      <Icon
        size={14}
        className={direction ? 'text-primary' : 'text-muted-foreground'}
      />
    </Button>
  )
}
