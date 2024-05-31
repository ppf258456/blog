const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middlewares/jwtMiddleware');
const checkRole = require('../middlewares/authMiddleware');

// 更新用户权限
router.put('/updateRole', auth, async (req, res, next) => {
  try {
    const { id, role } = req.body;

    if (!id || !role) {
      return res.status(400).json({ message: 'User ID and new role are required' });
    }

    const targetUser = await User.findByPk(id);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 检查当前用户是否有权限修改此用户
    if (req.currentUser.role !== 'admin' && req.currentUser.id !== targetUser.id) {
      return res.status(403).json({ message: 'Forbidden: You can only update your own profile' });
    }

    // 更新用户角色
    targetUser.role = role;
    await targetUser.save();

    res.json(targetUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
