const inpSearch = document.getElementById('search-input');
const ulSuggestion = document.getElementById('suggestions-list');
const selectStatus = document.getElementById('status');

// Danh sách các từ vựng
const jsonVocabularyList = localStorage.getItem('wordList')
const vocabularyList = JSON.parse(jsonVocabularyList);

let currentFilter = "all"; // Trạng thái mặc định là "Tất cả"
let currentSearch = "";

main();

function main() {
    renderWordList();
    inpSearch.addEventListener("input", handleInputChange);
    selectStatus.addEventListener("change", handleFilterChange);
}

function handleFilterChange(event) {
    currentFilter = event.target.value;
    renderWordList(currentSearch, currentFilter);
}

function renderWordList(word = '', status = 'all') {
    console.log(word);
    let wordListShow = [];

    if (status == 'all') {
        wordListShow = vocabularyList;
    }
    else {
        wordListShow = vocabularyList.filter((vocab) => vocab.status == status);
    }

    if (word != '') {
        wordListShow = wordListShow.filter((vocab) => vocab.word.toLowerCase().includes(word));
    }

    console.log(wordListShow);


    clearWordList();
    // Hiển thị danh sách từ vựng
    const ulWordList = document.getElementById('wordList');

    wordListShow.forEach((vocabulary, index) => {
        const li = document.createElement('li');

        const word = document.createElement('div');
        word.classList.add('word');
        word.textContent = vocabulary.word;

        const type = document.createElement('div');
        type.innerHTML = `<span class="type">${vocabulary.type || ''}</span>`;

        const pronounce = document.createElement('div');
        pronounce.innerHTML = `<span class="pronounce">${vocabulary.pronounce || ''}</span>`;

        const meaning = document.createElement('div');
        meaning.classList.add('meaning');
        meaning.textContent = `${vocabulary.meaning || ''}`;

        const note = document.createElement('div');
        note.classList.add('note');
        note.textContent = `${vocabulary.note || ''}`;

        // const createdAt = document.createElement('div');
        // createdAt.textContent = `Created at: ${vocabulary.createdAt}`;

        // const updatedAt = document.createElement('div');
        // updatedAt.textContent = `Updated at: ${vocabulary.updatedAt}`;

        const reference = document.createElement('a');
        reference.classList.add('action');
        reference.textContent = 'Reference';
        reference.href = vocabulary.reference;

        const spanDelete = document.createElement('span');
        spanDelete.classList.add('action');
        spanDelete.textContent = 'Delete';
        spanDelete.addEventListener('click', deleteVocab);

        const spanUpdate = document.createElement('span');
        spanUpdate.classList.add('action');
        spanUpdate.textContent = 'Update';
        spanUpdate.addEventListener('click', updateVocab);

        li.appendChild(word);
        li.appendChild(pronounce);
        li.appendChild(type);
        li.appendChild(meaning);
        li.appendChild(note);
        li.appendChild(reference);
        // li.appendChild(createdAt);
        // li.appendChild(updatedAt);
        li.appendChild(spanDelete);
        li.appendChild(spanUpdate);

        li.setAttribute('index', index);
        ulWordList.appendChild(li);
    });
}

function clearWordList() {
    const ul = document.getElementById('wordList');
    lis = ul.children;
    while (lis.length > 0) {
        lis[lis.length - 1].remove();
    }
    localStorage.setItem('wordList', JSON.stringify(vocabularyList));
}

function deleteVocab() {
    // const word = this.parentElement.children[0].innerHTML;
    // const indexDelete = vocabularyList.map(vocab => vocab.word).indexOf(word);
    indexDelete = Number(this.parentElement.getAttribute('index'));
    // console.log(this.parentElement.getAttribute('index'));
    if (indexDelete >= 0 && indexDelete < vocabularyList.length)
        vocabularyList.splice(indexDelete, 1);

    renderWordList();
}

function updateVocab() {
    const index = Number(this.parentElement.getAttribute('index'));
    if (index >= 0 && index < vocabularyList.length) {
        const data = {
            currentIndex: index
        }
        const searchParam = new URLSearchParams(data);
        const quesryString = searchParam.toString();
        window.location.href = 'form.html?' + quesryString;
        // console.log(queryString.toString());
    }

}

function handleInputChange(event) {
    currentSearch = event.target.value.toLowerCase();
    if (currentSearch != '') {
        const matchedWords = vocabularyList.filter((item) =>
            item.word.toLowerCase().includes(currentSearch)
        );

        // Hiển thị danh sách gợi ý từ gần giống
        showSuggestions(matchedWords);
    }
    else {
        ulSuggestion.innerHTML = "";
    }

}

function showSuggestions(words) {
    ulSuggestion.innerHTML = "";

    words.forEach((item) => {
        const li = document.createElement("li");
        li.innerText = item.word;
        li.dataset.word = item.word;

        li.addEventListener("click", handleWordClick);
        ulSuggestion.appendChild(li);
    });
}

function handleWordClick(event) {
    ulSuggestion.innerHTML = '';
    const word = event.target.dataset.word;

    // Hiển thị danh sách từ tương ứng
    renderWordList(word);
}






