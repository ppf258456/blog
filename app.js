// app.js
const dotenv = require('./config/dotenv');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sequelize = require('./config/db');
const auth = require('./middlewares/jwtMiddleware');
const session = require('express-session');

// const express = require('express');
// const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
// const sequelize = require('./config/database');

// const userRoutes = require('./routes/users');


var indexRouter = require('./routes/index');
const usersRouter = require('./routes/user/userRouter');
var roleRouter = require('./routes/role');
var loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
// const { error } = require('console');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// 删除静态文件服务
// app.use(express.static(path.join(__dirname, 'public')));





app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/role', roleRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);


// 使用身份验证中间件
app.use(auth);
app.use(session({
  secret: process.env.SESSION_SECRET, // 在.env文件中设置一个秘密字符串
  store: new SequelizeStore({ db: sequelize }),
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(({error:err.message}))// 修改返回为JSON格式
});

module.exports = app;
