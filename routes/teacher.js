const express = require("express");
const adminController = require('../controllers/teacher');
const router = express.Router();


router.post('/insert/question', adminController.InsertQuestion);
router.get('/delete/question/:questionId', adminController.deleteQuestion);
router.post('/insert/test', adminController.insertNewTest);
router.get('/delete/test/:testId', adminController.deleteTest);

module.exports = router;