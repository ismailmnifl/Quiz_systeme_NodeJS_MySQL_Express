let wrapper = document.getElementById('inputAnswers');
let trigger = document.getElementById('divBtn');
let inputNum = document.getElementById('nAnswers');
let num = inputNum.value;
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
    insertAnsewersInputs(inputNum.value);
})

function insertAnsewersInputs(key) {
    console.log(key);
    wrapper.innerHTML = "";
    for (let index = 0; index < key; index++) {
        wrapper.innerHTML += `
        <input type="text" placeholder="${numbers[index]} answer ..." name="answers-${index}" class="inputText" id="answers-${index}">
        `;
    }
}