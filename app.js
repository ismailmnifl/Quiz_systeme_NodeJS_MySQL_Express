const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');
const secureEnv = require('secure-env');
const session = require('express-session');
const cookieParser = require('cookie-parser');
dotenv.config({ path: './.env' });
const ejs = require('ejs');
const hbs = require('hbs');


const app = express();

global.env = secureEnv({ secret: 'mySecretPassword' });
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}))
app.use(cookieParser());
const db = mysql.createConnection({

    host: global.env.DATABASE_HOST,
    user: global.env.DATABASE_USER,
    password: global.env.DATABASE_PASSWORD,
    database: global.env.DATABASE

});

const publicDirectory = path.join(__dirname, './public');
//Adding public forlder for css and additional js files

app.use(express.static(publicDirectory));
//accept more form data from the any form
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('view engine', 'hbs');
//this required before view engine setup
hbs.registerPartials(__dirname + '/views/partials');

// view engine setup
app.set('views', path.join(__dirname, 'views'));



db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('MySQL database connected ...');
    }
});
//Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.listen(8000, () => {
    console.log("server started on port 8000");
});