import { NextResponse } from 'next/server'

import { auth } from '@/auth'
import prisma from '@/lib/db'

export async function PATCH(
  request: Request,
  { params }: { params: { email: string } }
) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 })
  }

  const body = await request.json()

  const { email, name, phone, hairdressers, otherInfo } = body

  if (!email || !name || !phone || !hairdressers) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  const existingCustomer = await prisma.customer.findUnique({
    where: {
      email: params.email,
    },
  })

  if (!existingCustomer) {
    return NextResponse.json({}, { status: 200 })
  }

  if (existingCustomer.hairdressers.length === 2) {
    return NextResponse.json({}, { status: 200 })
  }

  if (
    existingCustomer.hairdressers.includes('Timi') &&
    hairdressers === 'nem_Timi'
  ) {
    try {
      await prisma.customer.update({
        where: {
          email: params.email,
        },
        data: {
          email,
          name,
          otherInfo,
          phone,
          hairdressers: {
            push: 'nem_Timi',
          },
        },
      })
    } catch (error) {
      console.log({ error })
      return NextResponse.json({}, { status: 500 })
    }

    return NextResponse.json({}, { status: 200 })
  }

  if (
    existingCustomer.hairdressers.includes('nem_Timi') &&
    hairdressers === 'Timi'
  ) {
    try {
      await prisma.customer.update({
        where: {
          email,
        },
        data: {
          email,
          name,
          otherInfo,
          phone,
          hairdressers: {
            push: 'Timi',
          },
        },
      })
    } catch (error) {
      console.log({ error })
      return NextResponse.json({}, { status: 500 })
    }

    return NextResponse.json({}, { status: 200 })
  }

  try {
    await prisma.customer.update({
      where: {
        email: params.email,
      },
      data: {
        email,
        name,
        otherInfo,
        phone,
        hairdressers,
      },
    })
  } catch (error) {
    console.log({ error })
    return NextResponse.json({}, { status: 500 })
  }

  return NextResponse.json({}, { status: 200 })
}
