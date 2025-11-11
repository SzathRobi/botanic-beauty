'use client'

import { Dispatch, SetStateAction } from 'react'
import { DateRange } from 'react-day-picker'

import { DatePickerWithRange } from '@/components/ui/DatePicker'
import { Label } from '@/components/ui/Label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup'

import { TimeRange } from '../../types/timeRange.type'

type TimeRangeRadioGroupProps = {
  timeRange: TimeRange
  setTimeRange: Dispatch<SetStateAction<TimeRange>>
  // eslint-disable-next-line no-unused-vars
  onSelectDateRange: (date: DateRange | undefined) => void
  selectedDateRange: DateRange | undefined
}

const TimeRangeRadioGroup = ({
  timeRange,
  setTimeRange,
  onSelectDateRange,
  selectedDateRange,
}: TimeRangeRadioGroupProps) => {
  return (
    <div>
      <RadioGroup
        value={timeRange}
        defaultValue={timeRange}
        onValueChange={(value: TimeRange) => setTimeRange(value)}
        className="mb-8 flex items-center justify-center gap-4 text-white"
      >
        <div className="flex items-center">
          <RadioGroupItem
            value="day"
            aria-label="Toggle day"
            className="sr-only"
            id="day"
          />
          <Label
            className={`cursor-pointer transition ${timeRange === 'day' && 'text-primary'}`}
            htmlFor="day"
          >
            Nap
          </Label>
        </div>
        <div className="flex items-center">
          <RadioGroupItem
            value="week"
            aria-label="Toggle week"
            className="sr-only"
            id="week"
          />
          <Label
            className={`cursor-pointer transition ${timeRange === 'week' && 'text-primary'}`}
            htmlFor="week"
          >
            Hét
          </Label>
        </div>
        <div className="flex items-center">
          <RadioGroupItem
            value="month"
            aria-label="Toggle month"
            className="sr-only"
            id="month"
          />
          <Label
            className={`cursor-pointer transition ${timeRange === 'month' && 'text-primary'}`}
            htmlFor="month"
          >
            Hónap
          </Label>
        </div>
        <div className="flex items-center">
          <RadioGroupItem
            value="custom"
            aria-label="Toggle month"
            className="sr-only"
            id="custom"
          />
          <Label
            className={`cursor-pointer transition ${timeRange === 'custom' && 'text-primary'}`}
            htmlFor="custom"
          >
            Egyéni
          </Label>
        </div>
      </RadioGroup>

      {timeRange === 'custom' && (
        <div className="max-w-min">
          <DatePickerWithRange
            date={selectedDateRange}
            triggerSize="sm"
            triggerTitle="Válassz idősávot"
            //@ts-expect-error lalala
            onSelect={onSelectDateRange}
          />
        </div>
      )}
    </div>
  )
}

export default TimeRangeRadioGroup
