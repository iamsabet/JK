'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Button variant="ghost" size="icon">🌙</Button>
  }

  const toggle = () => {
    if (theme === 'dark') setTheme('light')
    else if (theme === 'light') setTheme('system')
    else setTheme('dark')
  }

  const icon = theme === 'dark' ? '☀️' : theme === 'light' ? '🌙' : '💻'

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
      {icon}
    </Button>
  )
}
