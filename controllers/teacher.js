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
const getAllquestion = (userID) => {

    return new Promise((resolve, reject) => {
        db.query(`
        SELECT * FROM questions
        INNER JOIN reponces
        ON reponces.question_index = questions.question_index
        INNER JOIN users
        ON users.user_index = questions.user_index
        where reponces.status = true
        AND users.user_index = ${userID}
    
    `, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results)

        });
    })
}


exports.getAllquestion = getAllquestion;
exports.InsertQuestion = (req, res) => {
    console.log(req.body);
    db.query('INSERT INTO questions SET ?', { user_index: req.session.userId, question: req.body.question }, async(error, results) => {
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
            let data = await getAllquestion(req.session.userId);
            res.render('dashboard', {
                insertMessage: "Question data has been saved",
                username: req.session.isLoggedIn,
                role: req.session.role,
                allQuestions: data
            });
            console.log(results);
        }
    });
}

exports.deleteQuestion = (req, res) => {

    console.log(req.params.questionId);
    db.query('delete from questions WHERE questions.question_index = ?', [req.params.questionId], async(error, results) => {
        if (error) {
            console.log(error);
        } else {
            let data = await getAllquestion(req.session.userId);
            res.render('dashboard', {
                message: "Question data has been saved",
                username: req.session.isLoggedIn,
                role: req.session.role,
                allQuestions: data
            });
        }
    })
}

const getAllTests = (userId) => {
    return new Promise((resolve, reject) => {
        db.query(`
        SELECT * FROM test INNER JOIN subject 
        on test.subject_index = subject.subject_index 
        where user_index = ${userId}`, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);

        });
    })
}
exports.getAllTests = getAllTests;