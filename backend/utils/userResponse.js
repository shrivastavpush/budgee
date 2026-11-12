const toPublicUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user }
  delete obj.password
  return obj
}

module.exports = { toPublicUser }
