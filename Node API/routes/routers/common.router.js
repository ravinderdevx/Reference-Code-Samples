const express = require('express');
const router = express.Router();

const commonController = require('../../controllers/common.controller');

router
.post('/contactus', commonController.contactUs);

module.exports = router;