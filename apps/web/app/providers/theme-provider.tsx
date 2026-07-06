'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // next-themes handles everything; this wrapper is kept for import compatibility
  return <>{children}</>
}
