// routes/user/userRouter.js

const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const { checkAuth,checkRole} = require('../../middlewares/authMiddleware');



// 查找用户并返回对应信息，带分页
router.get('/find', userController.findUser);

// 获取所有用户，带分页功能
router.get('/', checkAuth, userController.getAllUsers);

// 获取特定用户
router.get('/:id', checkAuth, userController.getUserById);

// 更新用户信息
router.put('/:id', checkAuth, userController.updateUser);

// 删除用户
router.delete('/', checkAuth, checkRole('admin'), userController.deleteUsers);




module.exports = router;