const mongoose = require('mongoose')
const bycrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: null },
}, { timestamps: true })

//hashing password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next
    this.password = await bycrypt.hash(this.password)
    next()
})

//comparing passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bycrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', UserSchema)