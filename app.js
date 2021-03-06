// include packages and setup server
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const bcrypt = require('bcryptjs')
const port = process.env.PORT || 3000

const db = require('./models')
const Todo = db.Todo
const User = db.User

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// setup the app
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(flash())

// use express session
app.use(session({
  secret: 'akpitdx',
  resave: 'false',
  saveUninitialized: 'false'
}))

// user passport
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)

app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})


// routes 
app.use('/', require('./routes/home.js'))
app.use('/users', require('./routes/user.js'))
app.use('/todos', require('./routes/todo.js'))
app.use('/auth', require('./routes/auths.js'))

// listening on express app
app.listen(port, () => {
  // db.sequelize.sync()
  console.log('Listening on express app...')
})