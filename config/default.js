//引入mysql
const config = {
    port: 3000,
}

//博客增删改需要登录 权限验证
//用户增删改查需要管理员登录 权限验证

const new1 = ((req,res,next) => {
    try{
    //用户登录后才可访问
    //检查用户是否登录
    //读取请求头
    const token = req.get("Authorization").split(" ")[1]
    // console.log(token);
    
       const decodeToken = jwt.verify(token,"haha")
       console.log(decodeToken);
       //解码成功 token有效
      next()
    
    }catch(e){
       //解码失败 token无效
       res.status(403).send(
           {
               status:"error",
               data:"token无效"
           }
       )
    
    }
})

module.exports = config


