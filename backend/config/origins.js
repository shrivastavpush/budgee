const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://budgee-rho.vercel.app',
  ...(process.env.NODE_ENV === 'production' ? [] : ['http://localhost:5173']),
].filter(Boolean)

module.exports = { allowedOrigins }
