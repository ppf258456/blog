// app.js
require('dotenv').config({ path: './.env' });
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sequelize = require('./config/database');
const config =require('./config/config')
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const http = require('http');

const socketIo = require('socket.io');



const indexRouter = require('./routes/index');
const registerRouter = require('./routes/registerRouter');
const loginRouter = require('./routes/loginRouter');
const logoutRouter = require('./routes/logoutRouter');
const checkOnlineRouter = require('./routes/checkOnlineRouter');
const userRouter = require('./routes/user/userRoute');
const verificationRoute = require('./routes/verificationRoute');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
// 提供静态文件
app.use(express.static(path.join(__dirname, 'public')));

// 日志记录中间件
app.use(logger('dev'));

// 解析JSON格式的请求体
app.use(express.json());

// 解析URL编码格式的请求体
app.use(express.urlencoded({ extended: false }));

// 解析Cookie
app.use(cookieParser());





// Session配置
app.use(session({
  secret: process.env.SESSION_SECRET, // 在.env文件中设置一个秘密字符串
  store: new SequelizeStore({ db: sequelize }), // 使用Sequelize存储session数据
  resave: false, // 如果session没有修改，不会保存
  saveUninitialized: true, // 保存未初始化的session
  cookie: { secure: process.env.NODE_ENV === 'production' } // 在生产环境中使用安全cookie
}));

// 同步数据库
sequelize.sync().then(() => {
  console.log('Database synchronized');
});

// 路由设置
app.use('/', indexRouter);
app.use('/register',registerRouter)
app.use('/login',loginRouter)
app.use('/logout',logoutRouter)
app.use('/checkOnline',checkOnlineRouter)
app.use('/user',userRouter)
app.use('/verification',verificationRoute)
// // 使用身份验证中间件
// app.use(auth);

// 捕获404错误并转发到错误处理器
app.use(function(req, res, next) {
  next(createError(404));
});

// 错误处理器
app.use(function(err, req, res, next) {
  // 设置本地变量，只在开发环境中提供错误信息
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 渲染错误页面
  res.status(err.status || 500);
  res.json({ error: err.message }); // 修改返回为JSON格式
});

module.exports = { app, server, io };
