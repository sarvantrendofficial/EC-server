const express = require('express');
const router = express.Router();
const { Login, Register, getMyProfile, verifyOtp, resendOtp } = require('../Controllers/userCtrl');

router.post('/login', Login);
router.post('/register', Register);
router.post('/verify', verifyOtp);
router.post('/resend', resendOtp);

router.get('/my-profile/:id', getMyProfile);

module.exports = router;