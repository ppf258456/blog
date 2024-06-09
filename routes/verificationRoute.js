// emailVerificationRoute.js
const express = require('express');
const emailVerificationController = require('../controllers/emailVerificationController');

const router = express.Router();

router.post('/send-verification-email', emailVerificationController.sendVerificationEmail);
router.post('/verify-code', emailVerificationController.verifyCode);

module.exports = router;