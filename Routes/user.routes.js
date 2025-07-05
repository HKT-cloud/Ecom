const express = require('express');
const userController = require('../Holder1/Controller/user.controller');

const router = express.Router();

router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.get('/logout', userController.logout);

module.exports = router;
