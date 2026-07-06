'use client'

import { useSearchParams } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense } from 'react'

function CheckoutContent() {
  const params = useSearchParams()
  const paymentId = params.get('paymentId')

  const { data: payment, refetch } = useQuery({
    queryKey: ['payment', paymentId],
    queryFn: async () => {
      if (!paymentId) return null
      const res = await fetch(`/api/payments/${paymentId}`)
      return res.json()
    },
    enabled: !!paymentId,
  })

  const checkMutation = useMutation({
    mutationFn: async () => {
      if (!paymentId) return
      const res = await fetch('/api/payments/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId }),
      })
      return res.json()
    },
    onSuccess: () => refetch(),
  })

  if (!payment) return <div className="p-8">در حال بارگذاری...</div>

  const tronUri = (payment as any).address ? `tron:${(payment as any).address}?amount=${(payment as any).amount}` : ''

  return (
    <div className="mx-auto max-w-md p-6">
      <Card>
        <CardHeader>
          <CardTitle>پرداخت با TRON (USDT-TRC20)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="text-sm text-muted-foreground">مبلغ دقیق</div>
          <div className="text-4xl font-bold">{(payment as any).amount} USDT</div>

          <div className="rounded-lg border p-3 font-mono text-sm break-all">{(payment as any).address}</div>

          {tronUri && (
            <div className="text-xs p-2 border rounded bg-muted break-all">
              {tronUri}
              <div className="mt-1 text-[10px] text-muted-foreground">(کپی آدرس + مبلغ در کیف پول TRON)</div>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            از کیف پول TRON خود مبلغ دقیق را ارسال کنید. سپس دکمه چک را بزنید.
          </div>

          <Button
            onClick={() => checkMutation.mutate()}
            disabled={checkMutation.isPending}
            className="w-full"
          >
            {checkMutation.isPending ? 'در حال بررسی...' : 'بررسی پرداخت'}
          </Button>

          {(payment as any).status === 'confirmed' && (
            <div className="text-emerald-600 font-medium">پرداخت تایید شد ✓</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function Checkout() {
  return (
    <Suspense fallback={<div className="p-8">در حال بارگذاری...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
