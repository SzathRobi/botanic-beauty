import { Client } from '@upstash/qstash'
import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/lib/db'

const client = new Client({ token: process.env.QSTASH_TOKEN! })

export async function POST(request: NextRequest) {
  const { booking, emailDelayInSeconds } = await request.json()

  if (!booking || !emailDelayInSeconds) {
    return NextResponse.json({ error: true, message: 'Invalid data' })
  }

  try {
    const result = await client.publishJSON({
      url: `${process.env.NODE_ENV === 'production' ? `https://botanic-beauty.hu` : 'https://major-candles-fall.loca.lt'}/api/email/reminder`,
      body: booking,
      delay: emailDelayInSeconds,
    })

    await prisma.booking.update({
      where: {
        id: booking.id,
      },
      data: {
        remindenEmailJobId: result.messageId,
      },
    })

    return NextResponse.json({ success: true, message: result })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: true, message: error })
  }
}
