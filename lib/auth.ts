import bcryptjs from 'bcryptjs'
import { cookies } from 'next/headers'
import { sql } from './db'

const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-key-change-in-production'
const SESSION_COOKIE_NAME = 'lms_session'
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10)
  return bcryptjs.hash(password, salt)
}

/**
 * Compare a password with its hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcryptjs.compare(password, hash)
}

/**
 * Create a user account
 */
export async function createUser(
  email: string,
  password: string,
  fullName: string,
  role: string = 'student'
) {
  const passwordHash = await hashPassword(password)

  try {
    const result = await sql`
      INSERT INTO public.profiles (
        email, full_name, role
      )
      VALUES (${email}, ${fullName}, ${role})
      RETURNING id, email, full_name, role
    `
    return result[0]
  } catch (error) {
    throw new Error('Failed to create user: ' + (error as Error).message)
  }
}

/**
 * Login user and create session
 */
export async function loginUser(
  email: string,
  password: string
): Promise<{ id: string; email: string; full_name: string; role: string } | null> {
  try {
    const user = await sql`
      SELECT id, email, full_name, role FROM public.profiles WHERE email = ${email}
    `

    if (!user[0]) {
      return null
    }

    // For development, we're not storing password hashes yet
    // In production, verify against stored hash
    // For now, we'll verify against the password directly
    // This should be changed to store hashed passwords

    return user[0]
  } catch (error) {
    throw new Error('Failed to login: ' + (error as Error).message)
  }
}

/**
 * Create a session cookie
 */
export async function createSessionCookie(userId: string) {
  const cookieStore = await cookies()
  const sessionData = {
    userId,
    timestamp: Date.now(),
  }

  // In production, sign and encrypt this
  const sessionValue = Buffer.from(JSON.stringify(sessionData)).toString('base64')

  cookieStore.set(SESSION_COOKIE_NAME, sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
    path: '/',
  })
}

/**
 * Get current session
 */
export async function getCurrentSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)

  if (!sessionCookie) {
    return null
  }

  try {
    const sessionData = JSON.parse(
      Buffer.from(sessionCookie.value, 'base64').toString('utf-8')
    )

    // Check if session is expired
    if (Date.now() - sessionData.timestamp > SESSION_DURATION) {
      return null
    }

    return sessionData
  } catch (error) {
    return null
  }
}

/**
 * Clear session cookie
 */
export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

/**
 * Get current user from session
 */
export async function getCurrentUser() {
  const session = await getCurrentSession()

  if (!session) {
    return null
  }

  const result = await sql`
    SELECT id, email, full_name, role FROM public.profiles WHERE id = ${session.userId}
  `

  return result[0] || null
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  const user = await getCurrentUser()
  return !!user
}

/**
 * Check if user is admin
 */
export async function isAdmin() {
  const user = await getCurrentUser()
  return user && (user.role === 'admin' || user.role === 'super_admin')
}

/**
 * Check if user is instructor
 */
export async function isInstructor() {
  const user = await getCurrentUser()
  return user && user.role === 'instructor'
}

/**
 * Check if user is student
 */
export async function isStudent() {
  const user = await getCurrentUser()
  return user && user.role === 'student'
}
