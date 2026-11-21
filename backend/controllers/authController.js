const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { toPublicUser } = require('../utils/userResponse')
const {
  signAccessToken,
  verifyRefreshToken,
  setRefreshCookie,
  clearRefreshCookie,
  readRefreshCookie,
} = require('../utils/tokens')

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8
const MAX_PASSWORD_LENGTH = 72 // bcrypt ignores bytes past 72
const MAX_EMAIL_LENGTH = 254
const MAX_NAME_LENGTH = 100
// Used to equalise timing when the email doesn't exist (prevents user enumeration).
const DUMMY_HASH = bcrypt.hashSync('timing-equaliser', 10)

// Short-lived access token in the body, long-lived refresh token in an httpOnly cookie.
const issueSession = (res, user, status) => {
  setRefreshCookie(res, user._id)
  res.status(status).json({
    id: user._id,
    user: toPublicUser(user),
    token: signAccessToken(user._id),
  })
}

const normalizeEmail = (email) => String(email).trim().toLowerCase()

exports.registerUser = async (req, res) => {
  const { fullName, email, password } = req.body

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  if (
    typeof fullName !== 'string' ||
    fullName.trim().length > MAX_NAME_LENGTH
  ) {
    return res.status(400).json({ message: 'Invalid name' })
  }

  if (
    typeof email !== 'string' ||
    email.length > MAX_EMAIL_LENGTH ||
    !EMAIL_REGEX.test(email.trim())
  ) {
    return res.status(400).json({ message: 'Invalid email format' })
  }

  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    })
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return res.status(400).json({
      message: `Password must be at most ${MAX_PASSWORD_LENGTH} characters`,
    })
  }

  try {
    const normalizedEmail = normalizeEmail(email)
    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' })
    }

    const user = await User.create({
      fullName: String(fullName).trim(),
      email: normalizedEmail,
      password,
    })

    issueSession(res, user, 201)
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({ message: 'Email already in use' })
    }
    console.error('Register Error:', error)
    res.status(500).json({ message: 'Error registering user' })
  }
}

exports.loginUser = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Invalid email format' })
  }

  try {
    const normalizedEmail = normalizeEmail(email)
    let user = await User.findOne({ email: normalizedEmail })
    if (!user) {
      // Older accounts may predate the schema's lowercase email normalization.
      user = await User.findOne({ email: normalizedEmail }).collation({
        locale: 'en',
        strength: 2,
      })
    }

    const valid = await bcrypt.compare(password, user?.password ?? DUMMY_HASH)
    if (!user || !valid) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    issueSession(res, user, 200)
  } catch (error) {
    console.error('Login Error:', error)
    res.status(500).json({ message: 'Error logging in' })
  }
}

exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').lean()

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json(user)
  } catch (error) {
    console.error('GetUser Error:', error)
    res.status(500).json({ message: 'Error fetching user info' })
  }
}

// Exchanges a valid refresh cookie for a new access token (and rotates the cookie).
exports.refreshToken = async (req, res) => {
  const token = readRefreshCookie(req)
  if (!token) {
    return res.status(401).json({ message: 'No refresh token' })
  }

  try {
    const decoded = verifyRefreshToken(token)
    if (!decoded) {
      clearRefreshCookie(res)
      return res.status(401).json({ message: 'Invalid refresh token' })
    }

    // One DB read per refresh (every ~15 min) also catches deleted accounts.
    const user = await User.findById(decoded.id).select('_id').lean()
    if (!user) {
      clearRefreshCookie(res)
      return res.status(401).json({ message: 'User not found' })
    }

    setRefreshCookie(res, user._id)
    res.json({ token: signAccessToken(user._id) })
  } catch {
    clearRefreshCookie(res)
    res.status(401).json({ message: 'Invalid refresh token' })
  }
}

exports.logoutUser = (req, res) => {
  clearRefreshCookie(res)
  res.status(200).json({ message: 'Logged out' })
}
