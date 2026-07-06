import { NextResponse } from 'next/server'
import { getCoach } from '@/lib/mock'

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const coach = getCoach(id)
  if (!coach) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(coach)
}
