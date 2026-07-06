import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().optional(),
  BOT_TOKEN: z.string().optional(),
  JWT_SECRET: z.string().default('dev-secret-change-me'),
  TRON_HOST: z.string().default('https://api.shasta.trongrid.io'),
  ADMIN_TELEGRAM_IDS: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().default('http://localhost:3000'),
})

export type Env = z.infer<typeof envSchema>

export const UNLOCK_PRICE = 2
export const USDT_DECIMALS = 6
