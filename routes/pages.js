const express = require("express");
const auth = require('../middleware/authMiddleware');
const authController = require('../controllers/auth');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});
router.get('/login', (req, res) => {
    res.render('login');
});


router.get('/register', (req, res) => {
    res.render('register');
});
router.get('/dashboard', auth, (req, res) => {
    res.render('dashboard');
});

router.get('/logout', authController.logout);

module.exports = router;