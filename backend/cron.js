const https = require('https')
const http = require('http')

const setupCron = () => {
  const backendUrl = process.env.RENDER_EXTERNAL_URL

  if (!backendUrl) {
    console.log(
      'No RENDER_EXTERNAL_URL environment variable found. Skipping keep-alive cron.'
    )
    return
  }

  console.log(`Initializing keep-alive cron for: ${backendUrl}`)

  const timer = setInterval(
    () => {
      const client = backendUrl.startsWith('http://') ? http : https
      client
        .get(backendUrl, (res) => {
          res.resume() // drain body so the socket is released
          if (res.statusCode === 200) {
            console.log('Keep-alive ping successful')
          } else {
            console.error(
              `Keep-alive ping failed with status: ${res.statusCode}`
            )
          }
        })
        .on('error', (err) => {
          console.error('Keep-alive ping error:', err.message)
        })
    },
    14 * 60 * 1000
  )

  timer.unref()
}

module.exports = setupCron
