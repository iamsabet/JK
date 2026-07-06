'use client'

import { useEffect } from 'react'

export function TelegramAuth() {
  useEffect(() => {
    // @ts-ignore
    const tg = (window as any).Telegram
    if (typeof window !== 'undefined' && tg?.WebApp) {
      const initData = tg.WebApp.initData
      if (initData) {
        fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData }),
        }).then(() => {
          // reload to pick up cookie
          // window.location.reload()
        })
      }
    }
  }, [])

  return null
}
