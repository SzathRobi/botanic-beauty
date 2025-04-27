import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  //   const maintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true'

  //   if (maintenanceMode && !request.nextUrl.pathname.startsWith('/maintenance')) {
  //     const url = request.nextUrl.clone()
  //     url.pathname = '/maintenance'
  //     return NextResponse.redirect(url)
  //   }

  console.log('kokain', request)

  return NextResponse.next()
}
