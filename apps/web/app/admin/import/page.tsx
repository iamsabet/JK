'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminImport() {
  const qc = useQueryClient()
  const [result, setResult] = useState<any>(null)

  const { data: coaches = [] } = useQuery({
    queryKey: ['coaches-count'],
    queryFn: async () => {
      const res = await fetch('/api/coaches')
      const data = await res.json()
      return data
    },
  })

  const importMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/admin/import', { method: 'POST' })
      return res.json()
    },
    onSuccess: (data) => {
      setResult(data)
      qc.invalidateQueries({ queryKey: ['coaches'] })
    },
  })

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>ورود مربیان از kosa.json</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>تعداد مربیان فعلی: {(coaches as any[]).length}</div>
          <Button onClick={() => importMutation.mutate()} disabled={importMutation.isPending}>
            {importMutation.isPending ? 'در حال ورود...' : 'ورود از kosa.json'}
          </Button>
          {result && (
            <div className="rounded bg-muted p-3 text-sm">
              {result.imported} مربی وارد شد.
            </div>
          )}
          <div className="text-xs text-muted-foreground">
            این صفحه فقط برای ادمین است. در محیط واقعی باید احراز هویت شود.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
