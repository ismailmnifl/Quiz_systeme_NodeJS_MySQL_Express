const mysql = require('mysql');
const secureEnv = require('secure-env');
const bcrypt = require('bcryptjs');



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

        db.query('INSERT INTO users SET ?', { name: username, email: email, password: hashedPassword, role_index: 2 }, (error, results) => {
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
    if (email == "" || password == "") {
        return res.render('login', {
            message: ' all the field are required'
        })
    }
    db.query('SELECT * from users where email = ?', [email], async(error, results) => {


        if (error) {
            console.log(error);
        }
        if (results.length > 0) {
            console.log(results);
            let hashedPass = await bcrypt.compare(password, results[0].password);
            if (hashedPass) {
                if (results[0].role_index == 1) {
                    delete req.session.isLoggedIn;
                    delete req.session.role;
                    delete req.session.userId;

                    req.session.isLoggedIn = results[0].name;
                    req.session.role = true;
                    req.session.userId = results[0].user_index;
                    res.redirect('/dashboard');
                    res.end();
                } else if (results[0].role_index == 2) {

                    delete req.session.isLoggedIn;
                    delete req.session.role;

                    req.session.isLoggedIn = results[0].name;
                    req.session.role = false;

                    res.redirect('/studentSpace');
                    res.end();
                }

            }

        } else {
            return res.render('login', {
                message: 'wrong email and password combination'
            });
        }
    });
}

exports.logout = (req, res) => {

    if (req.session.isLoggedIn) {
        delete req.session.isLoggedIn;
        delete req.session.role;
        res.redirect('/login');
        res.end();
    }

}