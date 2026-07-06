import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUser, mockDB } from '@/lib/mock'

export async function POST(req: Request) {
  const body = (await req.json()) as { coachId: string }
  const { coachId } = body

  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  let telegramId = 999999

  const user = getUser(telegramId)

  const payment = {
    id: 'pay_' + Date.now(),
    userId: user.id,
    type: 'unlock' as const,
    amount: 2,
    address: 'T' + Math.random().toString(36).slice(2, 12).toUpperCase(),
    reference: 'unlock_' + coachId,
    status: 'pending' as const,
  }

  mockDB.payments.push(payment)
  return NextResponse.json({ paymentId: payment.id })
}
