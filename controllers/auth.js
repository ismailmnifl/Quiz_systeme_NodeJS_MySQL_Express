const mysql = require('mysql');
const secureEnv = require('secure-env');
const bcrypt = require('bcryptjs');

//setting up prisma envirement
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();



global.env = secureEnv({ secret: 'mySecretPassword' });

const db = mysql.createConnection({

    host: global.env.DATABASE_HOST,
    user: global.env.DATABASE_USER,
    password: global.env.DATABASE_PASSWORD,
    database: global.env.DATABASE
});

exports.register = async(req, res) => {


    let userUsername = req.body.username;
    let userEmail = req.body.email;
    let userPassword = req.body.password;
    let userConfirmPass = req.body.confirmPass;



    if (userUsername == "" || userEmail == "" || userPassword == "" || userConfirmPass == "") {
        return res.render('register', {
            message: 'All the field are required'
        })
    }
    const selectedUser = await prisma.users.findFirst({ where: { email: userEmail } });
    if (selectedUser) {
        return res.render('register', {
            message: 'the email you provided is already in use'
        });
    } else if (userPassword !== userConfirmPass) {
        return res.render('register', {
            message: 'the two pasword fields are not adentical'
        });
    }
    let hashedPassword = await bcrypt.hash(userPassword, 8);

    const insertedUser = await prisma.users.create({
        data: {
            name: userUsername,
            email: userEmail,
            password: hashedPassword,
            role_index: 2,
        },
    }).catch((error) => {
        console.log(error);
    });
    console.log(insertedUser);
    if (insertedUser) {
        return res.render('register', {
            message: 'your infos have beer registered'
        });
    }

}

exports.login = async(req, res) => {


    let userEmail = req.body.email;
    let userPass = req.body.password;
    if (userEmail == "" || userPass == "") {
        return res.render('login', {
            message: 'all fields are required'
        });
    }

    const user = await prisma.users.findFirst({ where: { email: userEmail } });
    console.log(user);

    if (user) {
        let hashedPass = await bcrypt.compare(userPass, user.password);
        if (hashedPass) {
            if (user.role_index == 1) {
                delete req.session.isLoggedIn;
                delete req.session.role;
                delete req.session.userId;

                req.session.isLoggedIn = user.name;
                req.session.role = true;
                req.session.userId = user.user_index;
                res.redirect('/dashboard');
                res.end();
            } else if (user.role_index == 2) {

                delete req.session.isLoggedIn;
                delete req.session.role;

                req.session.isLoggedIn = user.name;
                req.session.role = false;

                res.redirect('/studentSpace');
                res.end();
            }

        } else {
            return res.render('login', {
                message: 'wrong email and password combination'
            });
        }
    } else {
        return res.render('login', {
            message: 'wrong email and password combination'
        });
    }
}

exports.logout = (req, res) => {

    if (req.session.isLoggedIn) {
        delete req.session.isLoggedIn;
        delete req.session.role;
        delete req.session.userId;
        res.redirect('/login');
        res.end();
    }

}