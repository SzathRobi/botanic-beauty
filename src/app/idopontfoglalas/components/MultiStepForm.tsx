'use client'

import {
  OpeningHour,
  Schedule,
  SpecialOpeningHour,
  TContactInfo,
  TService,
} from '@prisma/client'
import { motion } from 'framer-motion'
import { ReactNode, useState } from 'react'

import BackgroundBlur from '@/components/BackgroundBlur'
import { SERVICES } from '@/constants/services.constants'
import {
  BookingAvailability,
  dateFromCalendarKey,
  getBookingDateKey,
} from '@/lib/guest-booking'

import { mapMultistepFormDataToBooking } from '../mappers/mapMultistepFormdataToBooking.mapper'
import AvailableDatesForm from './AvailableDatesForm'
import ContactForm from './ContactForm'
import HairdresserForm from './HairdresserForm'
import ServicesForm from './ServicesForm'
import Stepper from './Stepper'
import SummaryForm from './SummaryForm'

type FadeInProps = {
  children: ReactNode
}

const FadeIn = ({ children }: FadeInProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ ease: 'easeInOut', duration: 0.75 }}
  >
    {children}
  </motion.div>
)

type MultiStepFormProps = {
  schedule: Schedule | null
  bookings: BookingAvailability[]
  serviceId: `${number}` | null
  openingHours: OpeningHour[]
  specialOpeningHours: SpecialOpeningHour[]
}

const MultiStepForm = ({
  bookings,
  schedule,
  serviceId,
  openingHours,
  specialOpeningHours,
}: MultiStepFormProps) => {
  const preSelectedService = SERVICES.find(
    (service) => service.id === serviceId
  )

  const [activeStep, setActiveStep] = useState(0)
  const [selectedService, setSelectedService] = useState<TService | null>(
    preSelectedService || null
  )
  const [selectedExtraServices, setSelectedExtraServices] = useState<
    TService[]
  >([])
  const [selectedHairdresser, setSelectedHairdresser] = useState<
    'Timi' | 'nem_Timi' | null
  >('Timi')
  const [selectedDate, setSelectedDate] = useState<Date>(() =>
    dateFromCalendarKey(getBookingDateKey(new Date())!)
  )
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [contactInfo, setContactInfo] = useState<TContactInfo>({
    name: '',
    email: '',
    phone: '',
    otherInfo: '',
  })
  const [salonBookings, setSalonBookings] =
    useState<BookingAvailability[]>(bookings)
  const [verificationEmailSent, setVerificationEmailSent] = useState(true)

  const selectService = (service: TService) => {
    setSelectedExtraServices([])
    setSelectedService(service)
    setSelectedTimeSlot(null)
  }

  const selectExtraService = (service: TService) => {
    setSelectedTimeSlot(null)
    setSelectedExtraServices((prev) =>
      prev.some((item) => item.id === service.id) ? prev : [...prev, service]
    )
  }

  const removeExtraService = (service: TService) => {
    setSelectedTimeSlot(null)
    setSelectedExtraServices((prev) =>
      prev.filter((item) => item.id !== service.id)
    )
  }

  const selectHairdresser = (hairdresser: 'Timi' | 'nem_Timi') => {
    setSelectedTimeSlot(null)
    setSelectedHairdresser(hairdresser)
  }

  const incrementActiveStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const decrementActiveStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const submitBooking = async (submittedContactInfo: TContactInfo) => {
    setContactInfo(submittedContactInfo)
    if (!selectedHairdresser || !selectedService || !selectedTimeSlot) {
      throw new Error('Kérlek válassz időpontot a foglaláshoz.')
    }
    let response: Response
    let data
    try {
      response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          mapMultistepFormDataToBooking({
            selectedHairdresser,
            selectedService,
            selectedExtraServices,
            contactInfo: submittedContactInfo,
            selectedDate,
            selectedTimeSlot,
          })
        ),
      })
      data = await response.json()
    } catch {
      throw new Error(
        'Nem kaptunk visszajelzést a foglalásról. Újabb foglalás előtt ellenőrizd az emailjeidet, vagy keress minket.'
      )
    }
    if (!response.ok || !data.success || !data.data) {
      if (
        data.message === 'Overlap with existing booking' ||
        data.message === 'Time slot is not available'
      ) {
        try {
          const latest = await fetch('/api/booking', { cache: 'no-store' })
          const availability = await latest.json()
          if (latest.ok && availability.success)
            setSalonBookings(availability.data)
        } catch {
          // The unavailable selection is cleared even if refreshing fails.
        }
        setSelectedTimeSlot(null)
        setActiveStep(2)
        throw new Error(
          'A kiválasztott időpont már nem elérhető. Kérlek válassz másik időpontot.'
        )
      }
      throw new Error(
        'Hoppá! Valami hiba történt a foglalás során. Kérlek próbáld meg később.'
      )
    }
    const saved = data.data as BookingAvailability
    setSalonBookings((previous) => [
      ...previous,
      {
        selectedDate: saved.selectedDate,
        selectedTimeSlot: saved.selectedTimeSlot,
        hairdresser: saved.hairdresser,
      },
    ])
    setVerificationEmailSent(
      data.notifications?.verificationEmailSent !== false
    )
  }

  const resetForm = () => {
    setActiveStep(0)
    setSelectedService(null)
    setSelectedExtraServices([])
    setSelectedHairdresser('Timi')
    setSelectedDate(dateFromCalendarKey(getBookingDateKey(new Date())!))
    setVerificationEmailSent(true)
    setSelectedTimeSlot(null)
    setContactInfo({
      name: '',
      email: '',
      phone: '',
      otherInfo: '',
    })
  }

  return (
    <div className="w-full sm:w-auto">
      <BackgroundBlur className="mx-auto flex min-h-[75vh] w-full min-w-[75vw] flex-col">
        <Stepper activeStep={activeStep} />

        <div className="flex flex-1 flex-col">
          {activeStep === 0 && (
            <FadeIn>
              <ServicesForm
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedTimeSlot={selectedTimeSlot}
                setSelectedTimeSlot={setSelectedTimeSlot}
                selectService={selectService}
                selectedService={selectedService}
                selectedExtraServices={selectedExtraServices}
                selectExtraService={selectExtraService}
                removeExtraService={removeExtraService}
                incrementActiveStep={incrementActiveStep}
              />
            </FadeIn>
          )}

          {activeStep === 1 && (
            <FadeIn>
              <HairdresserForm
                selectedHairdresser={selectedHairdresser}
                selectHairdresser={selectHairdresser}
                incrementActiveStep={incrementActiveStep}
                decrementActiveStep={decrementActiveStep}
              />
            </FadeIn>
          )}

          {activeStep === 2 && selectedService && (
            <FadeIn>
              <AvailableDatesForm
                bookings={salonBookings}
                setSelectedDate={setSelectedDate}
                selectedDate={selectedDate}
                selectedTimeSlot={selectedTimeSlot}
                setSelectedTimeSlot={setSelectedTimeSlot}
                selectedService={selectedService}
                selectedExtraServices={selectedExtraServices}
                selectedHairdresser={selectedHairdresser!}
                schedule={schedule ?? { offDays: [] }}
                isBookingConfigured={Boolean(schedule)}
                openingHours={openingHours}
                specialOpeningHours={specialOpeningHours}
                incrementActiveStep={incrementActiveStep}
                decrementActiveStep={decrementActiveStep}
              />
            </FadeIn>
          )}

          {activeStep === 3 &&
            selectedHairdresser &&
            selectedTimeSlot &&
            selectedService && (
              <FadeIn>
                <ContactForm
                  contactInfo={contactInfo}
                  saveContactInfo={setContactInfo}
                  incrementActiveStep={incrementActiveStep}
                  decrementActiveStep={decrementActiveStep}
                  submitBooking={submitBooking}
                />
              </FadeIn>
            )}

          {activeStep === 4 && selectedService && (
            <FadeIn>
              <SummaryForm
                contactInfo={contactInfo}
                verificationEmailSent={verificationEmailSent}
                selectedService={selectedService}
                selectedExtraServices={selectedExtraServices}
                selectedHairdresser={selectedHairdresser}
                selectedDate={selectedDate}
                selectedTimeSlot={selectedTimeSlot}
                resetForm={resetForm}
              />
            </FadeIn>
          )}
        </div>
      </BackgroundBlur>
    </div>
  )
}

export default MultiStepForm
