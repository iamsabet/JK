'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

export default function MyBookings() {
  const { data: bookings = [] } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const res = await fetch('/api/bookings')
      return res.json()
    },
  })

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">رزروهای من</h1>
        <Link href="/" className="text-sm text-muted-foreground hover:underline">بازگشت</Link>
      </div>

      {(bookings as any[]).length === 0 && (
        <div className="text-muted-foreground">هنوز رزرو ندارید.</div>
      )}

      <div className="space-y-4">
         {(bookings as any[]).map((b: any) => (
          <div key={b.id} className="rounded-2xl border p-4">
            <div className="flex justify-between">
              <div>مربی: {b.coachName}</div>
              <div className="font-mono text-sm">{b.totalPrice} USDT</div>
            </div>
            <div className="text-sm text-muted-foreground">وضعیت: {b.status}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
