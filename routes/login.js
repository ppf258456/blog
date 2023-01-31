const express = require('express');
const db = require('../db/db')
//引入jwt
const jwt = require('jsonwebtoken') 
const defaults = require('../config/default')
const bodyParser = require('body-parser')
const Router = express.Router();


//配置 解析post请求参数
Router.use(bodyParser.urlencoded({
    extended: false
}))
Router.use(bodyParser.json())

//登录相关
Router.post('/', (req,res)=>{
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
        else if (result.length === 0) {
             res.send({ 
                code: 401, 
                msg: '用户名或密码错误' 
            }); 
            return; 
        } else{
            let user 
            for( let item of result){
               user = item
            }
            headPortrait= user.headPortrait
            nickname= user.nickname
            
    
             //返回用户信息
         const token = jwt.sign({
            id:user.id,
            username:user.username,
            password:user.password,  
          },"haha",{
             expiresIn:"1d"
          })
          res.send({ 
            code: 200,
            msg: '登录成功',
            data:{
                token,
                headPortrait,
                nickname 
            }   
        });
        }   
    })  
})

// 增加用户信息(注册)

Router.post('/register', (req, res) => {
    //获取前端数据
    let username = req.body.username;
    let psw = req.body.password;
    let hp = req.body.headPortrait;
    let nickname = req.body.nickname;
    //判断该用户名是否存在
    db.query(`select * from user where username = '${username}' `, (err, result) => {
        if (err) {
            console.log(err);
            return
        } else if (result.length == 0) {
            db.query('insert into user set username=?,password=?,headPortrait=?,nickname=?',
                [username, psw, hp, nickname], (err, result) => {
                    if (err) {
                        console.log(err);
                        return
                    } else if (result.affectedRows == 1) {
                        res.json({
                            msg: '注册成功',
                            code: 200,
                            data: result
                        })
                    } else {
                        res.json({
                            msg: '注册失败',
                            code: 0
                        })
                    }
                })
        } else if (result.length == 1) {
            res.json({
                msg: '用户名重复，请重新输入！！！',
                code: 1
            })
        }
    })
})

module.exports = Router



