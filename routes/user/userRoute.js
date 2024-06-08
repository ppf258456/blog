// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const UserController  = require('../../controllers/user/userController');
const jwtMiddleware = require('../../middlewares/jwtMiddleware')
const checkUserOrAdminMiddleware = require('../../middlewares/checkUserOrAdminMiddleware')
const checkAdmin = require('../../middlewares/checkAdminMiddleware')

// 获取所有用户
router.get('/',  jwtMiddleware,  checkAdmin,UserController.getAllUsers);

// 获取个人资料
router.get('/userInfo/:user_id',jwtMiddleware,checkUserOrAdminMiddleware,UserController.getUserByUserid)

// 模糊查找用户
router.get('/:searchTerm', UserController.getSerchUsers);

// 更新用户信息
router.put('/:user_id',jwtMiddleware, checkUserOrAdminMiddleware, UserController.updateUser);

// 删除用户
router.delete('/:user_id',jwtMiddleware,checkUserOrAdminMiddleware, UserController.deleteUser);

module.exports = router;
