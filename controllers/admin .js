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

exports.InsertQuestion = (req, res) => {
    console.log('hello');
}