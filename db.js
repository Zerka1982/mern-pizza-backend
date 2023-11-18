const mongoose = require("mongoose");
require('dotenv').config()

const mongoURL = process.env.MONGO_URL
mongoose.connect(mongoURL, {useUnifiedTopology: true, useNewUrlParser: true})

let db = mongoose.connection

db.on('connected', () => {
    console.log('Mongo DB connection successful')
})

db.on('error', () => {
    console.log('Mongo DB connection failed')
})

module.exports = mongoose