const express = require('express');
const db = require('../db/db')
const bodyParser = require('body-parser')
const Router = express.Router();


//配置 解析post请求参数
Router.use(bodyParser.urlencoded({
    extended: false
}))
Router.use(bodyParser.json())
//博客相关
let data = []


//查询博客列表

Router.get('/', (req, res) => {
    //console.log(req.body);
    db.query('select * from bloglist', (err, result) => {
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


//查询博客内容

Router.get('/content/:id', (req, res) => {
    //console.log(req.params.id);
    const blid = req.params.id
    const contentsql = `select * from bloglist where id= '${blid}'`
    db.query(contentsql, (err, result) => {
        //返回错误信息   
        if (err) {
            console.error(err);
            return
        }
        //成功返回 
        else {
            res.json({
                data: result
            })
        }
    })
})

//添加博客分类

Router.post('/addClass', (req, res) => {
    //获取前端传入参数
    const bcName = req.body.blogClassificationName;
    //查询数据库中是否存在该分类
    const sql = `select * from blogclass where blogClassificationName = '${bcName}'`;
    //console.log(req.body.blogClassificationName);
    db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return
            }
            if (result.length === 0) {
                const addSql = `insert into blogclass (blogClassificationName) values ('${bcName}')`;
                db.query(addSql, (err, result) => {
                    // console.log(result);
                    if (err) {
                        console.log(err);
                    }
                    const data1 = {
                        code: 200,
                        msg: '添加分类成功'
                    }
                    res.json(data1);
                })

            } else {
                const data = {
                    code: 400,
                    msg: '该分类已存在，请重新添加'
                };
                res.json(data)
            }
        }

    )
})

// 博客类型

Router.get('/blogclass', (req, res) => {
    db.query('select * from blogclass ', [], (err, result) => {
        if (err) {
            console.log(err);
            return
        } else {
            res.json({
                msg: '成功获取',
                code: 200,
                data: result
            })
        }
    })
})

// 删除博客分类

Router.delete('/blogclass/:id', (req, res) => {
    db.query(`delete from blogclass where id =?`, [req.body.id], (err, result) => {
        if (err) {
            console.log(err);
            return
        } else if (result.affectedRows == 1) {
            res.json({
                msg: '删除成功',
                code: 200,
            })
        } else {
            res.json({
                msg: '删除失败'

            })
        }
    })
})

// 更改博客分类

Router.put('/updateclass/:id', (req, res) => {
    //获取更新博客id
    let id = req.params.id;
    //获取更新数据
    let name = req.body.blogClassificationName;
    db.query('update blogclass set  blogClassificationName=? ',
        [name], (err, result) => {
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

//添加博客

Router.post('/add', (req, res) => {
    //console.log(req.body);
    db.query('insert into bloglist set name=?,author=?,createTime=?,blogContent=?,Overheadstate=?,blogClassification=?',
        [req.body.name, req.body.author, req.body.createTime, req.body.blogContent, req.body.Overheadstate, req.body.blogClassification],
        (err, result) => {
            //console.log(result);
            if (err) {
                console.log(err);
                return
            } else if (result.affectedRows == 1) {
                res.send({
                    message: '插入成功',
                    code: 200,
                    data: result
                })
            } else {
                res.send({
                    message: '插入失败',
                    code: 0
                })
            }
        })

})

//删除博客

Router.delete('/delete/:id', (req, res) => {
    console.log(req.body);
    db.query('delete from bloglist where id=?', [req.body.id], (err, result) => {
        //console.log(result);
        if (err) {
            console.log(err);
            return
        } else if (result.affectedRows == 1) {
            res.send({
                message: '删除成功',
                code: 200,
                // data:data
            })
        } else {
            res.send({
                message: '删除失败',
                code: 400,
                // data:data
            })
        }
    })
})

//更新博客

Router.put('/update/:id', (req, res) => {
    //获取更新博客id
    let id = req.params.id;
    //获取更新数据
    let name = req.body.name;
    let blogContent = req.body.blogContent;
    let class_id = req.body.class_id;
    db.query('update bloglist set  name=?, blogContent=?,class_id=? ',
        [name, blogContent, class_id], (err, result) => {
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

//查找(搜索)博客

Router.post('/search', (req, res) => {

    let name = req.body.name;
    // let author = req.body.author;
    console.log(req.body);
    db.query(`SELECT * from bloglist WHERE name like "%${name}%" or author like "%${name}%"`,
        (err, result) => {
            if (err) {
                console.log(err);
                return
            } else(
                res.json({
                    msg: '查找成功',
                    code: 200,
                    data: result
                })
            )

        })
})





module.exports = Router