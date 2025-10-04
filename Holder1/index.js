const express = require('express')
const connectDB = require('./db')
const userRouter = require('./Holder1/Controller/user.controller')
const cookieparser = require('cookie-parser')
const app = express()



// Connect to database first
connectDB()
  .then(() => {
    console.log('Connected to database successfully')
    
    app.use(express.json())
    app.use('/user', userRouter)
    app.use(cookieparser())

    app.listen(3001, () => {
      console.log('Server is running on port 3001')
    })
  })
  .catch((error) => {
    console.error('Database connection error:', error)
    process.exit(1) // Exit process if database connection fails
  })