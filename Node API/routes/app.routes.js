const express = require('express');
const router = express.Router();

const { commonRouter, authRouter }  = require('./routers');

router.get('/', function(req, res, next) {
    res.json({status:"success", message:"API", data:{"version_number":"v1.0.0"}})
});
router.use('/common', commonRouter);
router.use('/auth', authRouter);


module.exports = router;
