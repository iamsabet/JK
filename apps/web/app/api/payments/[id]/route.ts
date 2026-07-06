import { NextResponse } from 'next/server'
import { mockDB } from '@/lib/mock'

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const payment = mockDB.payments.find((p) => p.id === id)
  if (!payment) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(payment)
}
