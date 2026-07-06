import { z } from 'zod'

export const CoachSchema = z.object({
  id: z.string(),
  sourceId: z.number(),
  nickname: z.string(),
  nameFa: z.string(),
  age: z.number(),
  city: z.string(),
  province: z.string(),
  basePrice: z.number(),
  images: z.array(z.string()),
  specialties: z.array(z.string()),
  description: z.string(),
  yearsExperience: z.number(),
  verified: z.boolean(),
  availability: z.object({
    weeklyDays: z.array(z.string()),
    timeSlots: z.array(z.string()),
  }),
})

export const UserSchema = z.object({
  id: z.string(),
  telegramId: z.number(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  photoUrl: z.string().optional(),
  unlockCredits: z.number(),
  isAdmin: z.boolean(),
})

export const BookingSchema = z.object({
  id: z.string(),
  userId: z.string(),
  coachId: z.string(),
  packageId: z.string(),
  status: z.enum(['pending_payment', 'confirmed', 'cancelled']),
  totalPrice: z.number(),
  createdAt: z.string(),
})

export const PaymentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(['unlock', 'booking']),
  amount: z.number(),
  address: z.string(),
  reference: z.string(),
  status: z.enum(['pending', 'confirmed', 'failed']),
  txHash: z.string().optional(),
  confirmedAt: z.string().optional(),
})

export type Coach = z.infer<typeof CoachSchema>
export type User = z.infer<typeof UserSchema>
export type Booking = z.infer<typeof BookingSchema>
export type Payment = z.infer<typeof PaymentSchema>
