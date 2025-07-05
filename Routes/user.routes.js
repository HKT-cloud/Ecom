const express = require('express');
const { login, signup, logout } = require('../Holder1/Controller/user.controller');

const router = express.Router();

// Routes
router.post('/login', login);
router.post('/signup', signup);
router.get('/logout', logout);
