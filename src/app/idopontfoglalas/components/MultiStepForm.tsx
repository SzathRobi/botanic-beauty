'use client'

import { Booking, Schedule, TService } from '@prisma/client'
import { motion } from 'framer-motion'
import { ReactNode, useEffect, useState } from 'react'

import BackgroundBlur from '@/components/BackgroundBlur'
import { SERVICES } from '@/constants/services.constants'

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
  bookings: Booking[]
  serviceId: `${number}` | null
}

const MultiStepForm = ({
  bookings,
  schedule,
  serviceId,
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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(Date.now()))
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    otherInfo: '',
  })

  const selectService = (service: TService) => {
    setSelectedExtraServices([])
    setSelectedService(service)
  }

  const selectExtraService = (service: TService) => {
    setSelectedExtraServices((prev) => [...prev, service])
  }

  const removeExtraService = (service: TService) => {
    setSelectedExtraServices((prev) =>
      prev.filter((item) => item.id !== service.id)
    )
  }

  const selectHairdresser = (hairdresser: 'Timi' | 'nem_Timi') => {
    setSelectedHairdresser('Timi')
  }

  const incrementActiveStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const decrementActiveStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const postBookingData = async (contactInfo: any) => {
    if (!selectedHairdresser || !selectedService || !selectedTimeSlot) return

    const response = await fetch('/api/booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        mapMultistepFormDataToBooking({
          selectedHairdresser,
          selectedService,
          selectedExtraServices,
          contactInfo,
          selectedDate,
          selectedTimeSlot,
        })
      ),
    })

    const data = await response.json()

    return data
  }

  const deleteBookingData = async (id: string) => {
    const response = await fetch(`/api/booking/${id}`, {
      method: 'DELETE',
    })

    const data = await response.json()

    return data
  }

  const resetForm = () => {
    setActiveStep(0)
    setSelectedService(null)
    setSelectedExtraServices([])
    setSelectedHairdresser('Timi')
    setSelectedDate(new Date(Date.now()))
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

          {activeStep === 2 && schedule && selectedService && (
            <FadeIn>
              <AvailableDatesForm
                bookings={bookings}
                setSelectedDate={setSelectedDate}
                selectedDate={selectedDate}
                selectedTimeSlot={selectedTimeSlot}
                setSelectedTimeSlot={setSelectedTimeSlot}
                selectedService={selectedService}
                selectedExtraServices={selectedExtraServices}
                selectedHairdresser={selectedHairdresser!}
                schedule={schedule}
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
                  setContactInfo={setContactInfo}
                  incrementActiveStep={incrementActiveStep}
                  decrementActiveStep={decrementActiveStep}
                  postBookingData={postBookingData}
                  deleteBookingData={deleteBookingData}
                  booking={mapMultistepFormDataToBooking({
                    selectedHairdresser,
                    selectedService,
                    selectedExtraServices,
                    contactInfo,
                    selectedDate,
                    selectedTimeSlot,
                  })}
                />
              </FadeIn>
            )}

          {activeStep === 4 && selectedService && (
            <FadeIn>
              <SummaryForm
                contactInfo={contactInfo}
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
