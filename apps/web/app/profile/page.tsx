'use client'

import { useQuery } from '@tanstack/react-query'

export default function Profile() {
  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await fetch('/api/me')
      if (!res.ok) return null
      return res.json()
    },
  })

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold">پروفایل</h1>

      {!user && <div>لطفا از طریق تلگرام وارد شوید.</div>}

      {user && (
        <div className="space-y-4 rounded-2xl border p-4">
          <div>
            <div className="text-sm text-muted-foreground">تلگرام</div>
            <div>{user.telegramId}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">اعتبار باز کردن گالری</div>
            <div className="text-2xl font-semibold">{user.unlockCredits}</div>
          </div>
          <div className="text-xs text-muted-foreground">
            برای تست محلی می‌توانید از آدرس با پارامتر initData استفاده کنید.
          </div>
        </div>
      )}
    </div>
  )
}
