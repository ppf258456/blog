const mysql = require('mysql2');
//创建连接对象
const db =  mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123456',
    port:3306,
    database:'blog',
});
module.exports=db