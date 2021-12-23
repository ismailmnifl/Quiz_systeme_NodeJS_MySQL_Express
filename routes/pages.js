const express = require("express");
const auth = require('../middleware/authMiddleware');
const login = require('../middleware/loginMiddleware');

const teacherController = require('../controllers/teacher');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {
        username: req.session.isLoggedIn,
        role: req.session.role
    });
});
router.get('/login', login, (req, res) => {
    res.render('login');
});


router.get('/register', (req, res) => {
    res.render('register');
});
router.get('/dashboard', auth, async(req, res) => {

    let data = await teacherController.getAllquestion(req.session.userId);
    let tests = await teacherController.getAllTests(req.session.userId);
    console.log(data);
    res.render('dashboard', {
        username: req.session.isLoggedIn,
        role: req.session.role,
        allQuestions: data,
        tests: tests

    });
});
router.get('/manageTest', auth, async(req, res) => {

    let data = await teacherController.getAllTests(req.session.userId);
    let subject = await teacherController.getAllSubject();
    console.log(data);
    res.render('manageTest', {
        username: req.session.isLoggedIn,
        role: req.session.role,
        allTheTests: data,
        allSubject: subject

    });
});
router.get('/studentSpace', auth, (req, res) => {
    res.render('studentSpace', {
        username: req.session.isLoggedIn,
        role: req.session.role
    });
});

module.exports = router;