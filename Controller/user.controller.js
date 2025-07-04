const express = require('express');
const router = express.Router();
const userRoutes = require('../../Routes/user.routes');

router.use('/api', userRoutes);

module.exports = router;