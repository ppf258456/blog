
const express = require('express');
const { checkAuth, checkRole } = require('../middlewares/authMiddleware');
const router = express.Router();
const registerController = require('../controllers/registerController');

router.post('/', registerController.register);

module.exports = router;
