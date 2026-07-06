import { z } from 'zod'
import { createHmac, timingSafeEqual } from 'crypto'
import * as jose from 'jose'

export interface TelegramUser {
  id: number
  first_name?: string
  last_name?: string
  username?: string
  photo_url?: string
}

export interface ParsedInitData {
  user: TelegramUser
  auth_date: number
  hash: string
  [key: string]: any
}

export function verifyTelegramInitData(
  initData: string,
  botToken?: string
): ParsedInitData | null {
  if (!initData) return null

  const params = new URLSearchParams(initData)
  const hash = params.get('hash')
  if (!hash) return null

  params.delete('hash')

  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n')

  if (!botToken) {
    // Dev bypass: accept any valid-shaped data
    try {
      const user = JSON.parse(params.get('user') || '{}')
      if (user && user.id) {
        return {
          user,
          auth_date: parseInt(params.get('auth_date') || '0', 10),
          hash,
        }
      }
    } catch {}
    return null
  }

  const secret = createHmac('sha256', 'WebAppData').update(botToken).digest()
  const hmac = createHmac('sha256', secret).update(dataCheckString).digest('hex')

  try {
    const expected = Buffer.from(hmac, 'hex')
    const provided = Buffer.from(hash, 'hex')
    if (expected.length !== provided.length) return null
    if (!timingSafeEqual(expected, provided)) return null
  } catch {
    return null
  }

  try {
    const user = JSON.parse(params.get('user') || '{}')
    return {
      user,
      auth_date: parseInt(params.get('auth_date') || '0', 10),
      hash,
    }
  } catch {
    return null
  }
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-me')

export async function signJWT(payload: object, expiresIn = '7d'): Promise<string> {
  const jwt = await new jose.SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret)
  return jwt
}

export async function verifyJWT<T = any>(token: string): Promise<T | null> {
  try {
    const { payload } = await jose.jwtVerify(token, secret)
    return payload as T
  } catch {
    return null
  }
}
