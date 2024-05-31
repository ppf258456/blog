// routes/users.js

const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const { checkAuth,checkRole} = require('../../middlewares/authMiddleware');


// 根据用户名或会员编号查找用户
// async function findUserByUniqueIdentifier(identifier) {
//     return await User.findOne({
//         where: {
//             $or: [{ name: identifier }, { memberNumber: identifier }]
//         }
//     });
// }

// // 创建新用户
// router.post('/', async (req, res, next) => {
//     try {
//         const { name, birthday, email, role, memberNumber,password } = req.body;

//         if (!name || !birthday || !email || !role || !memberNumber ||!password) {
//             return res.status(400).json({ message: 'All fields are required' });
//         }

//         // 创建用户
//         const newUser = await User.create({
//             name,
//             birthday,
//             email,
//             role,
//             memberNumber,
//             password
//         });

//         res.json(newUser);
//     }  catch (error) {
//         if (error.name === 'SequelizeValidationError') {
//             res.status(400).json({ message: error.errors[0].message });
//         } else {
//             next(error);
//         }
//     }
// });

// 查找用户并返回其ID
router.get('/find', userController.findUser);

// 查找用户并返回其ID
router.get('/find', userController.findUser);

// 获取所有用户
router.get('/', checkAuth, userController.getAllUsers);

// 获取特定用户
router.get('/:id', checkAuth, userController.getUserById);

// 更新用户信息
router.put('/:id', checkAuth, userController.updateUser);

// 删除用户
router.delete('/', checkAuth, checkRole('admin'), userController.deleteUsers);

module.exports = router;