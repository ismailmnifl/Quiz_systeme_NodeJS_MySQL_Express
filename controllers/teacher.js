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
    console.log(req.body);
    db.query('INSERT INTO questions SET ?', { user_index: req.session.userId, question: req.body.question }, (error, results) => {
        if (error) {
            console.log(error);
        } else {
            db.query('SELECT question_index FROM questions ORDER BY question_index DESC LIMIT 1', (error, lastInserted) => {
                if (error) {
                    console.log(error);
                } else {

                    db.query('INSERT INTO reponces SET ?', { question_index: lastInserted[0].question_index, responce: req.body.correctAnswer, status: true }, (error, results) => {
                        if (error) {
                            console.log(error);
                        } else {

                            for (let index = 0; index < req.body.nAnswers; index++) {
                                db.query('INSERT INTO reponces SET ?', { question_index: lastInserted[0].question_index, responce: req.body[`answers${index}`], status: false }, (error, results) => {

                                });
                            }
                        }
                    })
                }
            });
            res.render('dashboard', {
                message: "Question data has been saved",
                username: req.session.isLoggedIn,
                role: req.session.role
            });
            console.log(results);
        }
    });
}