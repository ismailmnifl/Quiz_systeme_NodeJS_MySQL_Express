document.getElementById('QuestionListBtn').addEventListener('click', () => {

    document.getElementById('questionsList').style.display = "block";
    document.getElementById('addQuestion').style.display = "none";



});

document.getElementById('AddQuestionBtn').addEventListener('click', () => {

    document.getElementById('questionsList').style.display = "none";
    document.getElementById('addQuestion').style.display = "block";



});