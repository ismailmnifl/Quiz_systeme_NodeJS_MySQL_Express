let wrapper = document.getElementById('inputAnswers');
let trigger = document.getElementById('divBtn');
let inputNum = document.getElementById('nAnswers');
let message = document.getElementById('message');
let numbers = [
    'first',
    'second',
    'third',
    'fourth',
    'fifth',
    'sixth',
    'seventh',
    'eighth',
];
trigger.addEventListener('click', () => {
    let num = inputNum.value;
    if (num > 6) {
        num = 6;
        message.innerHTML = `<div class="redLight">Answers can not be greater then 6</div>`;
        return;
    } else
        insertAnsewersInputs(num);
})

function insertAnsewersInputs(key) {
    console.log(key);
    wrapper.innerHTML = "";
    for (let index = 0; index < key; index++) {
        wrapper.innerHTML += `
        <input type="text" placeholder="${numbers[index]} answer ..." name="answers${index}" class="inputText" id="answers${index}">
        `;
    }
}