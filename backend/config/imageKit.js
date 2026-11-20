const ImageKit = require('@imagekit/nodejs')

let client

/** Lazily create the client so boot doesn't require ImageKit env vars. */
const getImageKit = () => {
  if (!client) {
    client = new ImageKit({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    })
  }
  return client
}

module.exports = {
  files: {
    upload: (...args) => getImageKit().files.upload(...args),
  },
}
