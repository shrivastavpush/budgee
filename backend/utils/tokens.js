const jwt = require('jsonwebtoken')

const ACCESS_TTL = '15m'
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000
const COOKIE_NAME = 'refreshToken'
const COOKIE_PATH = '/api/v1/auth'

const refreshSecret = () =>
  process.env.JWT_REFRESH_SECRET || `${process.env.JWT_SECRET}:refresh`

const signAccessToken = (id) =>
  jwt.sign({ id, typ: 'access' }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TTL,
    algorithm: 'HS256',
  })

const signRefreshToken = (id) =>
  jwt.sign({ id, typ: 'refresh' }, refreshSecret(), {
    expiresIn: Math.floor(REFRESH_TTL_MS / 1000),
    algorithm: 'HS256',
  })

const verifyRefreshToken = (token) => {
  const decoded = jwt.verify(token, refreshSecret(), { algorithms: ['HS256'] })
  return decoded?.typ === 'refresh' && decoded.id ? decoded : null
}

// Frontend (Vercel) and API (Render) are different sites in production,
// so the cookie must be SameSite=None; Secure there.
const cookieOptions = () => {
  const prod = process.env.NODE_ENV === 'production'
  return {
    httpOnly: true,
    secure: prod,
    sameSite: prod ? 'none' : 'lax',
    path: COOKIE_PATH,
  }
}

const setRefreshCookie = (res, userId) =>
  res.cookie(COOKIE_NAME, signRefreshToken(userId), {
    ...cookieOptions(),
    maxAge: REFRESH_TTL_MS,
  })

const clearRefreshCookie = (res) =>
  res.clearCookie(COOKIE_NAME, cookieOptions())

// Minimal cookie parsing; avoids adding cookie-parser for a single cookie.
const readRefreshCookie = (req) => {
  const header = req.headers.cookie
  if (!header) return null
  for (const part of header.split(';')) {
    const idx = part.indexOf('=')
    if (idx === -1) continue
    if (part.slice(0, idx).trim() === COOKIE_NAME) {
      try {
        return decodeURIComponent(part.slice(idx + 1).trim())
      } catch {
        return null
      }
    }
  }
  return null
}

module.exports = {
  signAccessToken,
  verifyRefreshToken,
  setRefreshCookie,
  clearRefreshCookie,
  readRefreshCookie,
}
