const express = require('express');
const router = express.Router();
const roleController = require('../controllers/rolePermissionsController');
const auth = require('../middlewares/jwtMiddleware');
const { checkRole } = require('../middlewares/authMiddleware');

// 更新用户权限
router.put('/updateRole', auth, roleController.updateRole);

//  查看用户权限
router.get('/:id', checkRole('admin'), roleController.getRolePermission);

module.exports = router;




