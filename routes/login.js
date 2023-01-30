const express = require('express');
const db = require('../db/db')
// const defaults = require('../config/default')
const bodyParser = require('body-parser')
const Router = express.Router();


//配置 解析post请求参数
Router.use(bodyParser.urlencoded({
    extended: false
}))
Router.use(bodyParser.json())


//登录相关
Router.post('/',(req,res)=>{
    //获取用户输入的用户名和密码
    const { username,password} =req.body
    
    //根据用户输入的用户名和密码对数据库进行查询 
    
    db.query('SELECT * FROM user WHERE username = ? AND password = ?',
    [username,password],(err,result)=>{
        if(err){
            console.log(err);
            res.send({
                code:500,
                msg:'服务器异常',
            })
            return 
        }
        if (result.length === 0) {
             res.send({ 
                code: 401, 
                msg: '用户名或密码错误' 
            }); 
            return; 
        } 
         //返回用户信息
        res.send({ 
            code: 200,
            msg: '登录成功',
            data:result 
            
        });
    })
  
   
   
   
})


module.exports = Router