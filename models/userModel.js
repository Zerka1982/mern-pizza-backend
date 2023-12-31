const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: { type: String, require },
    email: { type: String, require },
    password: { type: String, require },
    isAdmin: { type: Boolean, require, default: false },

    resetPasswordToken: String,
    resetPasswordExpires: Date,
  
}, {
    timestamps: true,
})

module.exports = mongoose.model('users', userSchema)