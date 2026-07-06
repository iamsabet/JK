import { Coach } from '@repo/types'
import { COACH_RAW_DATA } from './coaches-data'

export interface MockDB {
  coaches: Coach[]
  users: any[]
  payments: any[]
  bookings: any[]
  unlocks: any[]
}

export const mockDB: MockDB = {
  coaches: [],
  users: [],
  payments: [],
  bookings: [],
  unlocks: [],
}

let initialized = false

function enrichCoach(raw: any): Coach {
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

export function initMockData() {
  if (initialized) return
  if (mockDB.coaches.length === 0) {
    mockDB.coaches = COACH_RAW_DATA.map((raw) => enrichCoach(raw))
  }
  initialized = true
}

export function getCoaches(): Coach[] {
  initMockData()
  return mockDB.coaches
}

export function getCoach(id: string): Coach | undefined {
  return getCoaches().find((c) => c.id === id)
}

export function getUser(telegramId: number) {
  initMockData()
  let user = mockDB.users.find((u) => u.telegramId === telegramId)
  if (!user) {
    user = {
      id: `user_${telegramId}`,
      telegramId,
      unlockCredits: 3, // dev friendly: start with 3 free unlocks
      isAdmin: false,
    }
    mockDB.users.push(user)
  }
  return user
}
