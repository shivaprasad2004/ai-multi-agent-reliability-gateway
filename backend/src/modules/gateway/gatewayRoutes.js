const express = require('express');
const router = express.Router();
const { chat } = require('./gatewayController');
const apiKeyMiddleware = require('../../middlewares/apiKeyMiddleware');

router.post('/chat', apiKeyMiddleware, chat);

module.exports = router;

