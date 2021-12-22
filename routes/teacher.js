const express = require("express");
const adminController = require('../controllers/teacher');
const router = express.Router();


router.post('/insert/question', adminController.InsertQuestion);
router.get('/delete/question/:questionId', adminController.deleteQuestion);

module.exports = router;