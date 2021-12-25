const mysql = require('mysql');
const secureEnv = require('secure-env');
const bcrypt = require('bcryptjs');
global.env = secureEnv({ secret: 'mySecretPassword' });

//setting up prisma envirement
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const db = mysql.createConnection({

    host: global.env.DATABASE_HOST,
    user: global.env.DATABASE_USER,
    password: global.env.DATABASE_PASSWORD,
    database: global.env.DATABASE
});

const getAllquestion = async(userId) => {
    const getUserQuestions = await prisma.questions.findMany({
        where: {
            user_index: userId,
        },
        include: {
            reponces: true,
        }
    });
    return getUserQuestions;
    /* 
    return new Promise((resolve, reject) => {
        db.query(`
            SELECT * FROM questions
            INNER JOIN reponces
            ON reponces.question_index = questions.question_index
            INNER JOIN users
            ON users.user_index = questions.user_index
            where reponces.status = true
            AND users.user_index = ${userId}
    
        `, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results)

        });
    }) */
}


exports.getAllquestion = getAllquestion;
exports.InsertQuestion = async(req, res) => {
    const insertedQuestions = await prisma.questions.create({
        data: { user_index: req.session.userId, question: req.body.question, test_index: Number(req.body.test) }
    }).catch(async(error) => {
        if (error) {
            console.log(error);
        }
    });

    const lastInsertedQuestion = await prisma.questions.findFirst({
            orderBy: {
                question_index: "desc"
            }

        })
        .catch((error) => {
            console.log(error);
        });
    let num = lastInsertedQuestion.question_index

    const insertedRightAnswer = await prisma.reponces.create({
        data: {
            question_index: num,
            responce: req.body.correctAnswer,
            status: true
        }
    });
    for (let index = 0; index < req.body.nAnswers; index++) {
        const insertedRightAnswer = await prisma.reponces.create({
            data: {
                question_index: num,
                responce: req.body[`answers${index}`],
                status: false
            }
        });
    }
    let data = await getAllquestion(req.session.userId);
    return res.render('dashboard', {
        insertMessage: "Question data has been saved",
        username: req.session.isLoggedIn,
        role: req.session.role,
        allQuestions: data
    });

}

exports.deleteQuestion = (req, res) => {

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
    });
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

const insertNewTest = (req, res) => {

    const {
        referance,
        subject
    } = req.body;
    db.query('INSERT INTO test SET ?', { referance: req.body.referance, subject_index: req.body.subject, user_index: req.session.userId }, async(error, results) => {
        if (error) {
            console.log(error);
        } else {
            let data = await getAllTests(req.session.userId);
            let subject = await getAllSubject(req.session.userId);
            res.render('manageTest', {
                message: "the test has been added succesfuly",
                username: req.session.isLoggedIn,
                role: req.session.role,
                allTheTests: data,
                allSubject: subject

            });
            console.log(results);
        }
    });
}
exports.insertNewTest = insertNewTest;


const getAllSubject = (req, res) => {
    return new Promise((resolve, reject) => {
        db.query(`
        SELECT * FROM subject`, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);

        });
    })
}
exports.getAllSubject = getAllSubject;

const deleteTest = (req, res) => {

    db.query('delete from test WHERE test.test_index = ?', [req.params.testId], async(error, results) => {
        if (error) {
            console.log(error);
        } else {
            let data = await getAllTests(req.session.userId);
            let subject = await getAllSubject(req.session.userId);
            res.render('manageTest', {
                message: "the test has been added succesfuly",
                username: req.session.isLoggedIn,
                role: req.session.role,
                allTheTests: data,
                allSubject: subject

            });
        }
    })
}
exports.deleteTest = deleteTest;