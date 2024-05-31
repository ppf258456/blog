const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const auth = require('../middlewares/jwtMiddleware');

// 更新用户权限
router.put('/updateRole', auth, roleController.updateRole);

module.exports = router;
