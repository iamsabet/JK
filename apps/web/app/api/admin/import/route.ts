import { NextResponse } from 'next/server'
import { COACH_RAW_DATA } from '@/lib/coaches-data'

function enrichCoach(raw: any) {
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

export async function POST() {
  const mod = await import('@/lib/mock')
  const mockDB = mod.mockDB

  const existingIds = new Set(mockDB.coaches.map((c: any) => c.sourceId))
  let imported = 0

  for (const raw of COACH_RAW_DATA) {
    if (existingIds.has(raw.no)) continue
    mockDB.coaches.push(enrichCoach(raw))
    imported++
  }

  return NextResponse.json({ imported, total: mockDB.coaches.length })
}
