const inpWord = document.getElementById('word');
const inpWordType = document.getElementById('wordType');
const inpMeaning = document.getElementById('meaning');
const inpNote = document.getElementById('note');
const inpReference = document.getElementById('reference');
const inpStatus = document.getElementById('status');
const btnUpdate = document.getElementById('btnUpdate');
const btnAdd = document.getElementById('btnAdd');

const jsonWordList = localStorage.getItem('wordList');
let wordList = JSON.parse(jsonWordList);
let currentIndex = -1;

function getData() {
    return {
        word: inpWord.value,
        type: inpWordType.value,
        meaning: inpMeaning.value,
        note: inpNote.value,
        reference: inpReference.value,
        status: inpStatus.value,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
}
function fillData(index) {
    if (index >= 0) {
        vocab = wordList[index];
        inpWord.value = vocab.word;
        inpWordType.value = vocab.type;
        inpMeaning.value = vocab.meaning;
        inpNote.value = vocab.note;
        inpReference.value = vocab.reference;
        inpStatus.value = vocab.status;
    }
}
function clearData() {
    inpWord.value = '';
    inpWordType.value = '';
    inpMeaning.value = '';
    inpNote.value = '';
    inpReference.value = '';
    inpStatus.value = '';
}



function addVocab() {
    const data = getData();
    // let indexDuplicated = -1;
    let indexFinded = -1;
    wordList.find((vocab, index) => {
        if (vocab.word == data.word) {
            indexFinded = index;
        }
    });

    if (indexFinded == -1) {
        wordList.push(data);
        const jsonWordList = JSON.stringify(wordList);
        localStorage.setItem('wordList', jsonWordList);
        alert(`Đã thêm thành công.`);
    }
    else {
        fillData(indexFinded);
        alert(`Đã tồn tại từ vựng này. ID: ${indexFinded}`);
    }
}

function updateVocab(index) {
    if (index >= 0) {
        vocab = wordList[index];
        if (vocab.word != inpWord.value) {
            vocab.word = inpWord.value;
            vocab.type = inpWordType.value;
            vocab.meaning = inpMeaning.value;
            vocab.note = inpNote.value;
            vocab.reference = inpReference.value;
            vocab.updatedAt = new Date();
            const jsonWordList = JSON.stringify(wordList);
            localStorage.setItem('wordList', jsonWordList);
            alert('Cập nhật thành công.');
        }
        else {
            alert(`Đã tồn tại từ vựng này.`);
        }
    }
    else {
        alert('Cập nhật thất bại.');
    }
    
}

function main() {
    currentIndex = -1;
    console.log(currentIndex);
    if (wordList == null)
        wordList = [];

    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    
    if (params.get('currentIndex') != null) {
        currentIndex = Number(params.get('currentIndex'));
        btnAdd.style.display = 'none';
        btnUpdate.style.display = 'inline-block';
    }
    else {
        btnAdd.style.display = 'inline-block';
        btnUpdate.style.display = 'none';
    }
        

    console.log(params.get('currentIndex'));
    if (currentIndex >= 0 && currentIndex < wordList.length) {
        fillData(currentIndex)
    }
    else {
       clearData();
    }
    btnAdd.addEventListener("click", addVocab);
    btnUpdate.addEventListener("click", () => updateVocab(currentIndex));
}

main();