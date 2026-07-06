import { NextResponse } from 'next/server'
import { mockDB } from '@/lib/mock'

export async function POST(req: Request) {
  const { paymentId } = (await req.json()) as { paymentId: string }
  const payment = mockDB.payments.find((p) => p.id === paymentId)
  if (!payment) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  payment.status = 'confirmed'
  payment.confirmedAt = new Date().toISOString()

  if (payment.type === 'unlock') {
    const coachId = payment.reference.replace('unlock_', '')
    mockDB.unlocks.push({ telegramId: 999999, coachId, unlockedAt: new Date().toISOString() })
  }

  if (payment.type === 'booking') {
    const booking = mockDB.bookings.find((b) => b.id.includes(payment.reference.replace('booking_', '')))
    if (booking) booking.status = 'confirmed'
  }

  return NextResponse.json(payment)
}
