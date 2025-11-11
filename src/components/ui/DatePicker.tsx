'use client'

import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'
import { DateRange, DayPicker } from 'react-day-picker'

import { Button } from '@/components/ui/Button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover'
import { cn } from '@/lib/utils'

type DatePickerWithRangeProps = React.HTMLAttributes<HTMLDivElement> & {
  date: DateRange | undefined
  triggerSize?: 'default' | 'sm'
  triggerTitle?: string
  //   onSelect: (date: DateRange | undefined) => void
  onSelect: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}

export function DatePickerWithRange({
  className,
  triggerSize,
  triggerTitle = 'Válassz dátumot',
  date,
  onSelect,
}: DatePickerWithRangeProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover modal>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            size={triggerSize || 'default'}
            className={cn(
              `${triggerSize === 'sm' ? 'w-[240px]' : 'w-[300px]'} justify-start gap-2 text-left font-normal`,
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>{triggerTitle}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={`w-auto p-0`} align="start">
          <DayPicker
            mode="range"
            selected={date}
            defaultMonth={new Date()}
            weekStartsOn={1}
            locale={hu}
            onSelect={onSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
