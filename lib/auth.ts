import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET!

export interface TokenPayload {
  userId: string
  email: string
  userType: "tender" | "bidder"
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateVerificationToken(): string {
  // Generate a random token using crypto instead of JWT
  // This ensures the token is unique and doesn't change on each call
  const crypto = require('crypto')
  return crypto.randomBytes(32).toString('hex')
}

export function verifyEmailToken(token: string): boolean {
  // Since we're using random tokens now, we just need to verify it's a valid hex string
  // The actual verification happens by checking if it exists in the database
  return /^[a-f0-9]{64}$/.test(token)
}
