const express = require('express');
const router = express.Router();
const authUser = require('./authUser');


router.use("/user", authUser);

module.exports = router;