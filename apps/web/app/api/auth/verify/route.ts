import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = (await req.json()) as { initData?: string }
  const initData = body.initData || ''

  const params = new URLSearchParams(initData)
  let user: any = {}
  try { user = JSON.parse(params.get('user') || '{}') } catch {}

  const telegramId = user.id || 999999

  const { getUser } = await import('@/lib/mock')
  const u = getUser(telegramId)

  const res = NextResponse.json({ ok: true, user: u })
  res.cookies.set('token', 'dev', { path: '/' })
  return res
}
