//引入express
const express = require('express')
const path = require('path')
// 获取服务器的实例(对象)
const app = express()
const db = require('./db/db')
// 引用ejs
// const ejs =require('ejs')
// const config = require('./config/default');
 const { port } = require('./config/default');
const bodyParser = require('body-parser') 

//引入jwt
const jwt = require('jsonwebtoken') 

/*为app添加中间件处理跨域请求*/
app.use((req, res, next)=> {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept,Authorization");
    res.header('Access-Control-Allow-Credentials', true);
    res.header('X-Powered-By','3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    if(req.method=='OPTIONS'){
        //让options 请求快速返回
        res.sendStatus(200);
    }else{
        next();
    }
});

//加入html视图
// app.engine('html',ejs.__express)
// app.set('view engine', 'html')

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//解析前端数据
app.use(express.json())
//配置请求体解析
app.use(express.urlencoded({extended:false}))
//配置静态资源路径
// app.use(express.static(path.resolve(__dirname,'public')))



app.use('/blog',require('./routes/blog'))
app.use('/user',require('./routes/user'))
app.use('/login',require('./routes/login'))



















app.listen(port,()=>{
    console.log('成功启动');
})

