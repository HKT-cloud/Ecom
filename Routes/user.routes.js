// user.routes.js
const express = require('express');
const { login, signup, logout } = require('../Controller/user.controller');
const router = express.Router();

// These are mounted under /user
router.post('/login', login);
router.post('/signup', signup);
router.get('/logout', logout);

module.exports = router;
