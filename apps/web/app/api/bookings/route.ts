import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUser, getCoach, mockDB } from '@/lib/mock'

const PACKAGES = [
  { id: 'single', name: 'Single Session', multiplier: 1.0 },
  { id: 'two', name: '2 Sessions / Week', multiplier: 1.8 },
  { id: 'three', name: '3 Sessions / Week', multiplier: 2.5 },
]

function calc(base: number, mult: number, addons: string[]) {
  let t = base * mult
  if (addons.includes('gym')) t += 5
  if (addons.includes('video')) t += 3
  return Math.round(t * 100) / 100
}

export async function POST(req: Request) {
  const body = (await req.json()) as {
    coachId: string
    packageId: string
    date?: string
    time?: string
    addons?: string[]
  }
  const { coachId, packageId, date, time, addons = [] } = body

  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  let telegramId = 999999

  const user = getUser(telegramId)
  const coach = getCoach(coachId)
  if (!coach) return NextResponse.json({ error: 'Coach not found' }, { status: 404 })

  const pkg = PACKAGES.find((p) => p.id === packageId) || PACKAGES[0]
  const total = calc(coach.basePrice, pkg.multiplier, addons)

  const payment = {
    id: 'pay_' + Date.now(),
    userId: user.id,
    type: 'booking' as const,
    amount: total,
    address: 'T' + Math.random().toString(36).slice(2, 12).toUpperCase(),
    reference: 'booking_' + coachId,
    status: 'pending' as const,
  }

  const booking = {
    id: 'book_' + Date.now(),
    userId: user.id,
    coachId,
    coachName: coach.nickname,
    packageId,
    status: 'pending_payment',
    totalPrice: total,
    date,
    time,
    createdAt: new Date().toISOString(),
  }

  mockDB.payments.push(payment)
  mockDB.bookings.push(booking)

  return NextResponse.json({ paymentId: payment.id, bookingId: booking.id })
}

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  let telegramId = 999999

  const userBookings = mockDB.bookings.filter((b) => b.userId === getUser(telegramId).id)
  return NextResponse.json(userBookings)
}
