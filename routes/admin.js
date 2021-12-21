const express = require("express");
const adminController = require('../controllers/admin');
const router = express.Router();


router.post('/insert/user', adminController.InsertQuestion);

module.exports = router;