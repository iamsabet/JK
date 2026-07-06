import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUser, mockDB } from '@/lib/mock'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  let telegramId = 999999

  const user = getUser(telegramId)
  const unlocks = mockDB.unlocks.filter((u) => u.telegramId === telegramId).map((u) => u.coachId)

  return NextResponse.json({
    telegramId: user.telegramId,
    unlockCredits: user.unlockCredits,
    unlocks,
  })
}
