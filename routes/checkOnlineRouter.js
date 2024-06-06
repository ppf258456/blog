const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const checkOnlineController = require('../controllers/checkOnlineController');

router.get('/', jwtMiddleware, checkOnlineController.checkOnline);

module.exports = router;