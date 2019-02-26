
const express = require('express')
const path = require('path')
//const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
const index = require('./routes/index')
const users = require('./routes/users')
const sendMail = require('./routes/sendMail')
require('dotenv').config();

var app = express()
app.use(fileUpload());


const APP_PORT = process.env.PORT || 5000;
const server = app.listen(APP_PORT, () => {
    console.log(`App running on port ${APP_PORT}`);
})
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', index)
app.use('/users', users)
app.use('/sendMail', sendMail)



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

//error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error 2')
})

module.exports = server;
//app.listen(server, () => console.log(`Example app listening on port ${port}!`))