'use server'

import { SelectedDate } from '@/app/admin/beosztas/types/selectedDate.type'
import prisma from '@/lib/db'

export const addSchedule = async (schedule: SelectedDate[]) => {
  await prisma.schedule.create({
    data: {
      offDays: schedule.map((date) => ({
        date: date.date,
        person: date.person,
        displayMonth: date.displayMonth,
      })),
    },
  })
}

export const modifySchedule = async (
  schedule: SelectedDate[],
  scheduleId: string
) => {
  await prisma.schedule.update({
    where: {
      id: scheduleId,
    },
    data: {
      offDays: schedule.map((date) => ({
        date: date.date,
        person: date.person,
        displayMonth: date.displayMonth,
      })),
    },
  })
}

export const getSchedule = async () => {
  try {
    return await prisma.schedule.findFirst()
  } catch (error: any) {
    console.log({ error })
    throw new Error(error.message || error)
  }
}
