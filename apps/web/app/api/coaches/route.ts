import { NextResponse } from 'next/server'
import { getCoaches } from '@/lib/mock'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.toLowerCase() || ''
  const province = searchParams.get('province') || ''
  const city = searchParams.get('city') || ''

  let coaches = getCoaches()

  if (q) coaches = coaches.filter((c) => c.nickname.toLowerCase().includes(q) || c.city.toLowerCase().includes(q))
  if (province) coaches = coaches.filter((c) => c.province === province)
  if (city) coaches = coaches.filter((c) => c.city === city)

  return NextResponse.json(coaches)
}
