const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { toPublicUser } = require('../utils/userResponse')

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '10h' })
}

const normalizeEmail = (email) => String(email).trim().toLowerCase()

exports.registerUser = async (req, res) => {
  const { fullName, email, password, profileImageUrl } = req.body

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ message: 'Invalid email format' })
  }

  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
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
      profileImageUrl,
    })

    res.status(201).json({
      id: user._id,
      user: toPublicUser(user),
      token: generateToken(user._id),
    })
  } catch (error) {
    console.error('Register Error:', error)
    res
      .status(500)
      .json({ message: 'Error registering user', error: error.message })
  }
}

exports.loginUser = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  if (typeof email !== 'string') {
    return res.status(400).json({ message: 'Invalid email format' })
  }

  try {
    const user = await User.findOne({ email: normalizeEmail(email) })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    res.status(200).json({
      id: user._id,
      user: toPublicUser(user),
      token: generateToken(user._id),
    })
  } catch (error) {
    console.error('Login Error:', error)
    res.status(500).json({ message: 'Error logging in', error: error.message })
  }
}

exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json(user)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching user info', error: error.message })
  }
}
