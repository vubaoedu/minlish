import { createUI, getElement } from "./ui.js";

let idElements = {
    idSearchInput: '',
    idSuggestionElement: '',
};

const state = {
    criteria: '',
    currentSearch: '',
    dataSource: null,
    renderFn: null,
    keyShow: '',
};


export function createSearch(idSearchInput, idSuggestionElement, criteria = '', dataSource = null, renderFn = null, keyShow = '') {
    idElements = {idSearchInput, idSuggestionElement};
    state.criteria = criteria;
    state.dataSource = dataSource;
    state.renderFn = renderFn;
    state.keyShow = keyShow;
    createUI([idSearchInput], [idSuggestionElement]);
    const searchInput = getElement(idSearchInput);
    searchInput.addEventListener("input", handleInputChange);
    searchInput.addEventListener("keypress", handleEnterKeyPress);
}

export function handleInputChange(event) {
    const suggestionElement = getElement(idElements.idSuggestionElement);
    state.currentSearch = event.target.value.toLowerCase();
    if (state.currentSearch != '') {
        const matchedItem = state.dataSource.filter((item) =>
            item.word.toLowerCase().includes(state.currentSearch)
        );

        showSuggestions(matchedItem, state.keyShow);
    }
    else {
        suggestionElement.innerHTML = "";
    }

}

function showSuggestions(items, key) {
    const suggestionElement = getElement(idElements.idSuggestionElement);
    suggestionElement.innerHTML = "";

    items.forEach((item) => {
        const li = document.createElement("li");
        const key = state.keyShow;
        li.innerText = item[key];
        li.dataset[key] = item[key];

        li.addEventListener("click", handleItemClick);
        suggestionElement.appendChild(li);
    });
}

function handleItemClick(event) {
    hideSuggestionElement();

    state.currentSearch = event.target.textContent.toLowerCase();
    const searchElement = getElement(idElements.idSearchInput);
    searchElement.value = state.currentSearch;
    showResult();
}
function hideSuggestionElement() {
    const suggestionElement = getElement(idElements.idSuggestionElement);
    suggestionElement.innerHTML = '';
}
function showResult() {
    const search = {};
    search[state.criteria] = state.currentSearch;
    state.renderFn(search, null);
}

function handleEnterKeyPress(event) {
    if (event.keyCode === 13) {
        event.preventDefault(); 
        hideSuggestionElement();
        showResult();
    }
}