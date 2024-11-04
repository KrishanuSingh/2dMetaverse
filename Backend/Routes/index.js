const express = require('express');
const router = express.Router();
const authUser = require('./authUser');
const app = express();

router.use("/user", authUser);

module.exports = router;