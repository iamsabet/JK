'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Coach } from '@repo/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import Link from 'next/link'

interface CoachCardProps {
  coach: Coach
  isUnlocked: boolean
}

function CoachCard({ coach, isUnlocked }: CoachCardProps) {
  return (
    <Link href={`/coach/${coach.id}`}>
      <Card className="h-full cursor-pointer hover:shadow-lg transition-all hover:-translate-y-0.5">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-muted">
          <img
            src={coach.images[0]}
            alt={coach.nickname}
            className={`h-full w-full object-cover ${!isUnlocked ? 'blur-locked' : ''}`}
          />
          {!isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Badge variant="secondary" className="text-xs">قفل شده</Badge>
            </div>
          )}
          {coach.verified && (
            <Badge className="absolute right-2 top-2 bg-emerald-600">تایید شده</Badge>
          )}
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{coach.nickname}</CardTitle>
          <div className="text-sm text-muted-foreground">
            {coach.city} • {coach.province}
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-between text-sm">
          <div>{coach.age} سال • {coach.yearsExperience} سال تجربه</div>
          <div className="font-semibold">{coach.basePrice} USDT</div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function CoachList() {
  const [search, setSearch] = useState('')
  const [province, setProvince] = useState('')
  const [city, setCity] = useState('')
  const [minAge, setMinAge] = useState(18)
  const [maxAge, setMaxAge] = useState(40)

  const { data: coaches = [], isLoading } = useQuery<Coach[]>({
    queryKey: ['coaches'],
    queryFn: async () => {
      const res = await fetch('/api/coaches')
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

  const filtered = coaches
    .filter((c) => {
      const matchesSearch = !search || c.nickname.includes(search) || c.city.includes(search)
      const matchesProvince = !province || c.province === province
      const matchesCity = !city || c.city === city
      const matchesAge = c.age >= minAge && c.age <= maxAge
      return matchesSearch && matchesProvince && matchesCity && matchesAge
    })
    .sort((a, b) => a.basePrice - b.basePrice)

  const provinces = Array.from(new Set(coaches.map((c) => c.province)))

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="text-2xl font-bold">مربیان کشتی ایران</div>
          <div className="flex items-center gap-3">
            <Link href="/bookings">
              <Button variant="ghost">رزروهای من</Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost">پروفایل</Button>
            </Link>
            <Link href="/admin/import">
              <Button variant="outline" size="sm">ادمین</Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 flex flex-wrap gap-3">
          <Input
            placeholder="جستجو..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <select
            className="rounded-md border bg-background px-3 py-2 text-sm"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
          >
            <option value="">همه استان‌ها</option>
            {provinces.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <Input
            placeholder="شهر"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="max-w-[140px]"
          />
          <div className="flex items-center gap-2 text-sm">
            <span>سن</span>
            <input
              type="number"
              value={minAge}
              onChange={(e) => setMinAge(parseInt(e.target.value) || 18)}
              className="w-16 rounded border px-2 py-1"
            />
            <span>تا</span>
            <input
              type="number"
              value={maxAge}
              onChange={(e) => setMaxAge(parseInt(e.target.value) || 40)}
              className="w-16 rounded border px-2 py-1"
            />
          </div>
        </div>

        {isLoading ? (
          <div>در حال بارگذاری...</div>
        ) : (
          <div className="coach-grid">
            {filtered.map((coach) => (
              <CoachCard
                key={coach.id}
                coach={coach}
                isUnlocked={!!user?.unlocks?.includes(coach.id)}
              />
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">مربی یافت نشد</div>
        )}
      </div>
    </div>
  )
}
