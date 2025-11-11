'use client'

import { Booking, Customer } from '@prisma/client'
import { useMemo, useState } from 'react'
import { DateRange } from 'react-day-picker'

import { SERVICES } from '@/constants/services.constants'

import { TimeRange } from '../types/timeRange.type'
import { filterBookingsByTimeRange } from '../utils/filterBookingsByTimeRange.util'
import BleachMaterialUsageChart from './bleachMaterialUsageChart/BleachMaterialUsageChart'
import ClientGrowthChart from './clientGrowthChart/ClientGrowthChart'
import DyeMaterialUsageChart from './dyeMaterialUsageChart/DyeMaterialUsageChart'
import MoneyEarnedChart from './moneyEarnedChart/MoneyEarnedChart'
import NumberOfBookingsChart from './numberOfBookingsChart/NumberOfBookingsChart'
import NumberOfCustomersChart from './numberOfCustomersChart/NumberOfCustomersChart'
import NumberOfReturningCustomersChart from './numberOfReturningCustomersChart/NumberOfReturningCustomersChart'
import ServicePopularityChart from './servicePopularityChart/ServicePopularityChart'
import TimeRangeRadioGroup from './timeRangeRadioGroup/TimeRangeRadioGroup'
import TotalBookingsChart from './totalBookingsChart'

type AnalyticsContainerProps = {
  bookings: Booking[]
  customers: Customer[]
}

const AnalyticsContainer = ({
  bookings,
  customers,
}: AnalyticsContainerProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('day')
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  const onCustomDateRangeChange = (dateRange: DateRange | undefined) => {
    setDateRange(dateRange)
  }

  const filteredBookings = useMemo(
    () =>
      bookings.filter((booking) =>
        filterBookingsByTimeRange(booking.selectedDate, timeRange, dateRange)
      ),
    [timeRange, bookings, dateRange]
  )

  return (
    <div className="mb-12">
      <TimeRangeRadioGroup
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        onSelectDateRange={onCustomDateRangeChange}
        selectedDateRange={dateRange}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* NOT affected by timerange */}
        <NumberOfCustomersChart numberOfCustomers={customers.length} />

        <MoneyEarnedChart
          filteredBookings={filteredBookings.filter((b) => b.isFinanceDone)}
        />

        <BleachMaterialUsageChart filteredBookings={filteredBookings} />

        <DyeMaterialUsageChart filteredBookings={filteredBookings} />

        <NumberOfReturningCustomersChart
          bookings={filteredBookings}
          customers={customers}
        />

        <NumberOfBookingsChart numberOfBookings={filteredBookings.length} />

        <div className="col-span-1 lg:col-span-2">
          <TotalBookingsChart
            filteredBookings={filteredBookings}
            timeRange={timeRange}
            selectedDateRange={dateRange}
          />
        </div>

        <div className="col-span-1 lg:col-span-2">
          <ServicePopularityChart
            filteredBookings={filteredBookings}
            salonServices={SERVICES}
          />
        </div>

        <div className="col-span-1 lg:col-span-2">
          <ClientGrowthChart salonCustomers={customers} timeRange={timeRange} />
        </div>
      </div>
    </div>
  )
}

export default AnalyticsContainer
