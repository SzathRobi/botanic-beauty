import { Booking } from '@prisma/client'

import {
  EXTRA_SERVICE_HAIRCUT,
  EXTRA_SERVICE_MIRACLE_BOOSTER,
} from '@/constants/services.constants'

const MOCK_BOOKING_CONTACT_INFO: Booking['contactInfo'] = {
  name: 'John Doe',
  email: 'jdoe@me.com',
  phone: '1234567890',
  otherInfo: 'Additional info',
}

const MOCK_BOOKING_OTHER_CONTACT_INFO: Booking['contactInfo'] = {
  name: 'Jane Doe',
  email: 'janedoe@me.com',
  phone: '1111567890',
  otherInfo: null,
}

const MOCK_BOOKING_ANOTHER_CONTACT_INFO: Booking['contactInfo'] = {
  name: 'Jani Doe',
  email: 'janidoe@me.com',
  phone: '1111567890',
  otherInfo: null,
}

const MOCK_BOOKING_SERVICE: Booking['service'] = {
  category: 'Styling',
  duration: 60,
  name: 'Férfi gépi hajvágás, átmenettel',
  price: 4500,
  id: '1',
}

export const MOCK_BOOKING: Booking = {
  contactInfo: MOCK_BOOKING_CONTACT_INFO,
  hairdresser: 'Timi',
  createdAt: new Date(),
  extraServices: [],
  id: '1',
  service: MOCK_BOOKING_SERVICE,
  selectedDate: new Date().toString(),
  selectedTimeSlot: '10:00 - 11:00',
  updatedAt: new Date(),
  finalPrice: 0,
  dyeMaterialUsage: 0,
  bleachMaterialUsage: 0,
  extraHaircutPrice: 0,
  miracleBoosterPrice: 0,
  isFinanceDone: false,
  financeComment: null,
  isPaidWithCard: null,
  discountPercentage: null,
  tips: null,
  remindenEmailJobId: null,
}

export const MOCK_BOOKING_WITH_EXTRA_SERVICES: Booking = {
  ...MOCK_BOOKING,
  id: '2',
  contactInfo: MOCK_BOOKING_OTHER_CONTACT_INFO,
  extraServices: [EXTRA_SERVICE_HAIRCUT, EXTRA_SERVICE_MIRACLE_BOOSTER],
}

export const MOCK_BOOKINGS_WITH_FINANCE_DONE: Booking = {
  ...MOCK_BOOKING,
  id: '3',
  finalPrice: 9500,
  dyeMaterialUsage: 5,
  bleachMaterialUsage: 5,
  extraHaircutPrice: 0,
  miracleBoosterPrice: 3000,
  isFinanceDone: true,
  contactInfo: MOCK_BOOKING_ANOTHER_CONTACT_INFO,
}

export const MOCK_BOOKINGS: Booking[] = [
  MOCK_BOOKING,
  MOCK_BOOKING_WITH_EXTRA_SERVICES,
  MOCK_BOOKINGS_WITH_FINANCE_DONE,
]
