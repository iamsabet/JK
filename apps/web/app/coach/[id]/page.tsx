'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { Coach } from '@repo/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

const PACKAGES = [
  { id: 'single', name: 'Single Session', multiplier: 1.0 },
  { id: 'two', name: '2 Sessions / Week', multiplier: 1.8 },
  { id: 'three', name: '3 Sessions / Week', multiplier: 2.5 },
  { id: 'weekend', name: 'Weekend Intensive', multiplier: 2.0 },
  { id: 'monthly', name: 'Monthly Program', multiplier: 3.5 },
]

const ADDONS = [
  { id: 'gym', name: 'Private Gym', price: 5 },
  { id: 'video', name: 'Video Analysis', price: 3 },
]

function calcTotal(base: number, mult: number, addonIds: string[]) {
  let t = base * mult
  for (const a of ADDONS) if (addonIds.includes(a.id)) t += a.price
  return Math.round(t * 100) / 100
}

export default function CoachProfile() {
  const params = useParams<{ id: string }>()
  const [showUnlock, setShowUnlock] = useState(false)
  const [showBook, setShowBook] = useState(false)
  const [selectedPkg, setSelectedPkg] = useState('single')
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  const { data: coach } = useQuery<Coach>({
    queryKey: ['coach', params.id],
    queryFn: async () => {
      const res = await fetch(`/api/coaches/${params.id}`)
      return res.json()
    },
  })

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await fetch('/api/me')
      if (!res.ok) return null
      return res.json()
    },
  })

  if (!coach) return <div className="p-8">در حال بارگذاری...</div>

  const isUnlocked = !!((user as any)?.unlocks && (user as any).unlocks.includes(coach.id))
  const pkg = PACKAGES.find((p) => p.id === selectedPkg) || PACKAGES[0]
  const total = calcTotal(coach.basePrice, pkg.multiplier, selectedAddons)

  const handleUnlock = async () => {
    const res = await fetch('/api/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coachId: coach.id }),
    })
    const data = (await res.json()) as { paymentId?: string }
    if (data.paymentId && typeof globalThis !== 'undefined' && 'window' in globalThis) {
      ;(globalThis as any).window.location.href = `/checkout?paymentId=${data.paymentId}`
    }
  }

  const handleBook = async () => {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        coachId: coach.id,
        packageId: selectedPkg,
        date: selectedDate,
        time: selectedTime,
        addons: selectedAddons,
      }),
    })
    const data = (await res.json()) as { paymentId?: string }
    if (data.paymentId && typeof globalThis !== 'undefined' && 'window' in globalThis) {
      ;(globalThis as any).window.location.href = `/checkout?paymentId=${data.paymentId}`
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link href="/" className="text-sm text-muted-foreground hover:underline">← بازگشت به لیست</Link>

        <div className="mt-4 grid gap-8 md:grid-cols-5">
          <div className="md:col-span-3">
            <h1 className="text-3xl font-bold">{coach.nickname}</h1>
            <p className="text-muted-foreground">{coach.city} • {coach.province} • {coach.age} سال</p>

            <div className="mt-6">
              <h3 className="mb-3 font-semibold">گالری</h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {coach.images.map((img: string, i: number) => (
                  <div key={i} className="relative aspect-video overflow-hidden rounded-xl bg-muted">
                    <img src={img} alt="" className={`h-full w-full object-cover ${!isUnlocked ? 'blur-locked' : ''}`} />
                    {!isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Button size="sm" onClick={() => setShowUnlock(true)}>باز کردن (۲ USDT)</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="mb-2 font-semibold">توضیحات</h3>
              <p className="text-sm text-muted-foreground">{coach.description}</p>
            </div>

            <div className="mt-6">
              <h3 className="mb-2 font-semibold">تخصص‌ها</h3>
              <div className="flex flex-wrap gap-2">
                {coach.specialties.map((s: string) => <Badge key={s} variant="outline">{s}</Badge>)}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>رزرو جلسه</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">قیمت پایه</div>
                  <div className="text-2xl font-semibold">{coach.basePrice} USDT</div>
                </div>

                <div>
                  <div className="mb-1 text-sm font-medium">پکیج</div>
                  <select className="w-full rounded-md border bg-background p-2" value={selectedPkg} onChange={(e) => setSelectedPkg((e.target as any).value)}>
                    {PACKAGES.map((p) => <option key={p.id} value={p.id}>{p.name} — ×{p.multiplier}</option>)}
                  </select>
                </div>

                <div>
                  <div className="mb-1 text-sm font-medium">تاریخ شروع</div>
                   <input type="date" className="w-full rounded-md border bg-background p-2" value={selectedDate} onChange={(e) => setSelectedDate((e.target as HTMLInputElement).value)} />
                </div>

                <div>
                  <div className="mb-1 text-sm font-medium">ساعت</div>
                  <select className="w-full rounded-md border bg-background p-2" value={selectedTime} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedTime(e.target.value)}>
                     {coach.availability.timeSlots.map((t: string) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <div className="mb-2 text-sm font-medium">افزونه‌ها</div>
                  {ADDONS.map((a) => (
                    <label key={a.id} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={selectedAddons.includes(a.id)} onChange={(e) => {
                        setSelectedAddons(e.target.checked ? [...selectedAddons, a.id] : selectedAddons.filter(x => x !== a.id))
                      }} />
                      {a.name} (+{a.price} USDT)
                    </label>
                  ))}
                </div>

                <div className="rounded-lg border p-3 text-sm">مجموع: <span className="font-semibold">{total} USDT</span></div>

                <Button className="w-full" onClick={() => setShowBook(true)}>رزرو و پرداخت</Button>
                {!isUnlocked && <Button variant="outline" className="w-full" onClick={() => setShowUnlock(true)}>باز کردن گالری (۲ USDT)</Button>}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showUnlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowUnlock(false)}>
          <div className="w-full max-w-md rounded-2xl bg-background p-6" onClick={e => e.stopPropagation()}>
            <div className="mb-4"><h2 className="text-lg font-semibold">باز کردن گالری</h2></div>
            <div className="space-y-4">
              <p className="text-sm">با پرداخت ۲ USDT می‌توانید تصاویر این مربی را ببینید (۳ پروفایل).</p>
              <Button onClick={handleUnlock} className="w-full">پرداخت ۲ USDT</Button>
            </div>
            <button onClick={() => setShowUnlock(false)} className="absolute right-4 top-4 text-sm">✕</button>
          </div>
        </div>
      )}

      {showBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowBook(false)}>
          <div className="w-full max-w-md rounded-2xl bg-background p-6" onClick={e => e.stopPropagation()}>
            <div className="mb-4"><h2 className="text-lg font-semibold">تایید رزرو</h2></div>
            <div className="space-y-4 text-sm">
              <div>مربی: {coach.nickname}</div>
              <div>پکیج: {pkg.name}</div>
              <div>تاریخ: {selectedDate || '—'} ساعت {selectedTime}</div>
              <div>مجموع: <span className="font-semibold">{total} USDT</span></div>
              <Button onClick={handleBook} className="w-full">ادامه به پرداخت TRON</Button>
            </div>
            <button onClick={() => setShowBook(false)} className="absolute right-4 top-4 text-sm">✕</button>
          </div>
        </div>
      )}
    </div>
  )
}
