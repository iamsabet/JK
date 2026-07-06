import { Coach } from '@repo/types'

export interface Package {
  id: string
  name: string
  sessionsPerWeek: number
  multiplier: number
}

export const PACKAGES: Package[] = [
  { id: 'single', name: 'Single Session', sessionsPerWeek: 1, multiplier: 1.0 },
  { id: 'two', name: '2 Sessions / Week', sessionsPerWeek: 2, multiplier: 1.8 },
  { id: 'three', name: '3 Sessions / Week', sessionsPerWeek: 3, multiplier: 2.5 },
  { id: 'weekend', name: 'Weekend Intensive', sessionsPerWeek: 2, multiplier: 2.0 },
  { id: 'monthly', name: 'Monthly Program', sessionsPerWeek: 3, multiplier: 3.5 },
]

export const ADDONS = [
  { id: 'gym', name: 'Private Gym', price: 5 },
  { id: 'video', name: 'Video Analysis', price: 3 },
  { id: 'nutrition', name: 'Nutrition Advice', price: 4 },
]

export function calculateTotal(
  basePrice: number,
  pkg: Package,
  addonIds: string[]
): number {
  let total = basePrice * pkg.multiplier
  for (const a of ADDONS) {
    if (addonIds.includes(a.id)) total += a.price
  }
  return Math.round(total * 100) / 100
}

export function enrichCoach(raw: any, index: number): Coach {
  const base = 15 + (raw.age % 30)
  return {
    id: `coach_${raw.no}`,
    sourceId: raw.no,
    nickname: raw.name_fa,
    nameFa: raw.name_fa,
    age: raw.age,
    city: raw.city,
    province: raw.province,
    basePrice: base,
    images: [
      `https://picsum.photos/seed/coach${raw.no}_1/800/600`,
      `https://picsum.photos/seed/coach${raw.no}_2/800/600`,
      `https://picsum.photos/seed/coach${raw.no}_3/800/600`,
    ],
    specialties: ['Freestyle', 'Greco-Roman', 'Conditioning'].slice(0, 1 + (raw.no % 3)),
    description: `Coach from ${raw.city}, ${raw.province} with focus on technique and conditioning.`,
    yearsExperience: Math.max(3, Math.min(12, raw.age - 18)),
    verified: raw.no % 3 !== 0,
    availability: {
      weeklyDays: ['sat', 'sun', 'mon'],
      timeSlots: ['08:00-09:00', '17:00-18:00'],
    },
  }
}
