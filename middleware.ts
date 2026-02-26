import { type NextRequest, NextResponse } from 'next/server'
import { verifySessionToken } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // For now, just pass through - session validation will happen in protected routes
  // We'll verify tokens when accessing protected pages
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
