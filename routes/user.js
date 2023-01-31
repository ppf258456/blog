const express = require('express');
const db = require('../db/db')
const bodyParser = require('body-parser')
const Router = express.Router();


//配置 解析post请求参数
Router.use(bodyParser.urlencoded({
    extended: false
}))
Router.use(bodyParser.json())

let data = []

// 查看用户列表

Router.get('/', (req, res) => {
    //console.log(req.body);
    db.query('select * from user', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send({
                msessage: '成功获取数据',
                code: 200,
                data: result,
            })
        }

    })
})

// 查询(搜索)用户

Router.post('/search', (req, res) => {
    let name = req.body.name;
    // let author = req.body.author;
    console.log(req.body);
    db.query(`SELECT * from user WHERE username like "%${name}%" or nickname like "%${name}%"`,
        (err, result) => {
            if (err) {
                console.log(err);
                return
            } else if (result.length == 0) {
                res.json({
                    msg: '无此用户',
                    code: 0
                })
            } else {
                res.json({
                    msg: '查找成功',
                    code: 200,
                    data: result
                })
            }
        })
})

// 更新用户信息

Router.put('/update/:id', (req, res) => {
    //获取更新博客id
    let id = req.params.id;
    //获取更新数据
    let name = req.body.nickname;
    let psw = req.body.password;
    let hp = req.body.headPortrait;
    db.query('update user set  nickname=?, password=?,headPortrait=? ',
        [name, psw, hp], (err, result) => {
            if (err) {
                console.log(err);
                return
            } else if (result.affectedRows > 0) {
                res.json({
                    code: 0,
                    msg: '更改成功'
                });
            } else {
                res.json({
                    code: 1,
                    msg: '更新失败'
                })
            }
        })
})


// 删除用户(注销)

Router.delete('/delete/:id',(req, res)=>{
     db.query('delete from user where id = ?',[req.params.id],(err, result)=>{
        if(err){
            console.log(err);
            return 
        }else if(result.affectedRows == 1){
            res.json({
                msg:'注销成功！',
                code:200,
            })
        }else{
            res.json({
                msg:'注销失败，请重试！',
                code:0
            })
        }
     })
})

module.exports = Router