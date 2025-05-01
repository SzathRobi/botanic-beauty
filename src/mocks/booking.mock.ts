import { Booking } from '@prisma/client'

const MOCK_BOOKING_CONTACT_INFO: Booking['contactInfo'] = {
  name: 'John Doe',
  email: 'jdoe@me.com',
  phone: '1234567890',
  otherInfo: 'Additional info',
}

const MOCK_BOOKING_SERVICE: Booking['service'] = {
  category: 'Styling',
  duration: 60,
  name: 'Férfi gépi hajvágás, átmenettel',
  price: 100,
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
}
