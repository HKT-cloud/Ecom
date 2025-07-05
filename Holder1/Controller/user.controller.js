const express = require('express');
const router = express.Router();
const userRoutes = require('../../Routes/user.routes');

// Remove duplicate routing since we're mounting at /user in server.js
module.exports = userRoutes;