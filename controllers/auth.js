const mysql = require('mysql');
const secureEnv = require('secure-env');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const session = require('express-session');

global.env = secureEnv({ secret: 'mySecretPassword' });

const db = mysql.createConnection({

    host: global.env.DATABASE_HOST,
    user: global.env.DATABASE_USER,
    password: global.env.DATABASE_PASSWORD,
    database: global.env.DATABASE
});

exports.register = (req, res) => {
    console.log(req.body);

    const {
        username,
        email,
        password,
        confirmPass
    } = req.body;

    if (req.body.username == "" || req.body.email == "" || req.body.password == "" || req.body.confirmPass == "") {
        return res.render('register', {
            message: 'All the field are required'
        })
    }
    db.query('SELECT email from users WHERE email = ?', [email], async(error, results) => {
        if (error) {
            console.log(error);
        }
        if (results.length > 0) {
            return res.render('register', {
                message: 'the email you provided is already in use'
            });
        } else if (password !== confirmPass) {
            return res.render('register', {
                message: 'the two pasword fields are not adentical'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ?', { name: username, email: email, password: hashedPassword }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                res.render('register', {
                    message: "you informations have been registered successfully"
                });
                console.log(results);
            }
        });
    });
}

exports.login = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    db.query('SELECT * from users where email = ?', [email], async(error, results) => {


        if (error) {
            console.log(error);
        }
        if (results.length > 0) {
            console.log(results);
            let hashedPass = await bcrypt.compare(password, results[0].password);
            if (hashedPass) {

                req.session.isLoggedIn = results[0].name;
                console.log(req.session.isLoggedIn);
                res.locals.logged = {
                    status: true,
                    name: req.session.isLoggedIn
                }
                res.redirect('/dashboard');
            }

        } else {
            return res.render('login', {
                message: 'wrong email and password combination'
            });
        }
    });
}

exports.logout = (req, res) => {
    delete req.session.isLoggedIn;
    res.redirect(req.get('referer'));
}