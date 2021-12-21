const express = require("express");
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {
        username: req.session.isLoggedIn,
    });
});
router.get('/login', (req, res) => {
    res.render('login');
});


router.get('/register', (req, res) => {
    res.render('register');
});
router.get('/dashboard', auth, (req, res) => {
    res.render('dashboard', {
        username: req.session.isLoggedIn,
        role: true
    });
});

router.get('/studentSpace', auth, (req, res) => {
    res.render('studentSpace', {
        username: req.session.isLoggedIn,
        role: false

    });
});

module.exports = router;