const express = require('express');
const mysql = require('mysql');
const { rootCertificates } = require('tls');
const dotenv = require('dotenv');
const path = require('path');
const secureEnv = require('secure-env');

dotenv.config({ path: './.env' });

const app = express();

global.env = secureEnv({ secret: 'mySecretPassword' });

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