'use client'

import { Dispatch, SetStateAction } from 'react'

import { Label } from '@/components/ui/Label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup'

import { TimeRange } from '../../types/timeRange.type'

type TimeRangeRadioGroupProps = {
  timeRange: TimeRange
  setTimeRange: Dispatch<SetStateAction<TimeRange>>
}

const TimeRangeRadioGroup = ({
  timeRange,
  setTimeRange,
}: TimeRangeRadioGroupProps) => {
  return (
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
          value="3month"
          aria-label="Toggle month"
          className="sr-only"
          id="3month"
        />
        <Label
          className={`cursor-pointer transition ${timeRange === '3month' && 'text-primary'}`}
          htmlFor="3month"
        >
          3 Hónap
        </Label>
      </div>
    </RadioGroup>
  )
}

export default TimeRangeRadioGroup
