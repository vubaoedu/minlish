const ui = {
    idFields: [],
    fieldElements: {},
    btnElements: {},
    createUI: function(idFields) {
        this.idFields = [...idFields];
        for (let id of idFields) {
            this.fieldElements[id] = document.getElementById(id);
        }
    },
    input: function() {
        const obj = {};
        for (let id of this.idFields) {
            obj[id] = this.fieldElements[id].value;
        }
        obj['createdAt'] = new Date();
        obj['updatedAt'] = new Date();
        return obj;
    },
    output: function(obj) {
        for (let id of this.idFields) {
            this.fieldElements[id].value = obj[id].value;
        }
    },
    clear: function() {
        for (let id of this.idFields) {
            this.fieldElements[id].value = '';
        }
    }
}




// const inpWord = document.getElementById('word');
// const inpWordType = document.getElementById('wordType');
// const inpPronounce = document.getElementById('pronounce');
// const inpMeaning = document.getElementById('meaning');
// const inpNote = document.getElementById('note');
// const inpReference = document.getElementById('reference');
// const inpStatus = document.getElementById('status');
// const btnUpdate = document.getElementById('btnUpdate');
// const btnAdd = document.getElementById('btnAdd');

const idFields = ['word', 'wordType', 'pronounce', 'meaning', 'note', 'reference', 'status'];

ui.createUI(idFields);

const data = {
    wordList: [],
    currentIndex: -1,
    loadData: function() {
        const jsonWordList = localStorage.getItem('wordList');
        this.wordList = JSON.parse(jsonWordList);
        if (this.wordList == null)
            this.wordList = [];
    }
}

// function getObject(idFields) {
//     const obj = {};
//     for (let id of idFields) {
//         obj[id] = ui.fieldElements[id].value;
//     }
//     obj['createdAt'] = new Date();
//     obj['updatedAt'] = new Date();
// }

// function fillData(index) {
//     if (index >= 0) {
//         vocab = wordList[index];
//         inpWord.value = vocab.word;
//         inpWordType.value = vocab.type;
//         inpPronounce.value = vocab.pronounce;
//         inpMeaning.value = vocab.meaning;
//         inpNote.value = vocab.note;
//         inpReference.value = vocab.reference;
//         inpStatus.value = vocab.status;
//     }
// }

// function clearData() {
//     inpWord.value = '';
//     inpWordType.value = '';
//     inpPronounce.value = '';
//     inpMeaning.value = '';
//     inpNote.value = '';
//     inpReference.value = '';
//     inpStatus.value = '';
// }

function addVocab() {
    const newVocab = ui.input();
    // let indexDuplicated = -1;
    let indexFinded = -1;
    data.wordList.find((vocab, index) => {
        if (vocab.word == newVocab.word) {
            indexFinded = index;
        }
    });

    if (indexFinded == -1) {
        data.wordList.push(newVocab);
        const jsonWordList = JSON.stringify(data.wordList);
        localStorage.setItem('wordList', jsonWordList);
        alert(`Đã thêm thành công.`);
    }
    else {
        fillData(indexFinded);
        alert(`Đã tồn tại từ vựng này. ID: ${indexFinded}`);
    }
}

function updateVocab(index) {
    if (index >= 0 && index < wordList.length) {
        vocab = wordList[index];
        vocab.word = inpWord.value;
        vocab.type = inpWordType.value;
        vocab.pronounce = inpPronounce.value;
        vocab.meaning = inpMeaning.value;
        vocab.note = inpNote.value;
        vocab.reference = inpReference.value;
        vocab.status = inpStatus.value;
        vocab.updatedAt = new Date();
        const jsonWordList = JSON.stringify(wordList);
        localStorage.setItem('wordList', jsonWordList);
        alert('Cập nhật thành công.');
    }
    else {
        alert('Cập nhật thất bại.');
    }
    
}

function main() {
    data.loadData();

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
    if (data.currentIndex >= 0 && data.currentIndex < data.wordList.length) {
        ui.output(data.wordList[data.currentIndex]);
    }
    else {
       ui.clear();
    }
    btnAdd.addEventListener("click", addVocab);
    btnUpdate.addEventListener("click", () => updateVocab(currentIndex));
}

main();