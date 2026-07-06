import type { Metadata } from 'next'
import { Inter, Vazirmatn } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { ThemeProvider } from 'next-themes'
import { QueryProvider } from './providers/query-provider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const vazir = Vazirmatn({ subsets: ['arabic'], variable: '--font-vazir' })

export const metadata: Metadata = {
  title: 'Wrestling Coaches',
  description: 'Find and book wrestling coaches across Iran',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${inter.variable} ${vazir.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem storageKey="coach-theme">
          <QueryProvider>
            {children}
            <Toaster position="top-center" richColors closeButton />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
