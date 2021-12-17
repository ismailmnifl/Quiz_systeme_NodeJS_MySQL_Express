const mysql = require('mysql');
const secureEnv = require('secure-env');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { enable } = require('express/lib/application');


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
    console.log(req.body);
    res.send('working');
}