const express = require('express');
const AdminAuthController = require('../controllers/AdminAuthController').default;

const router = express.Router();

router.post('/login', AdminAuthController.login);

module.exports = router;
