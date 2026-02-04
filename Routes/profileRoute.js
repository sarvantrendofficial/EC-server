const express = require('express');
const router = express.Router();
const { CreateProfile, updateProfile } = require('../Controllers/userProCtrl');

router.post('/create-profile', CreateProfile);
router.put('/update-profile/:id', updateProfile);

module.exports = router;