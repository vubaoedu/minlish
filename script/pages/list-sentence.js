import { getData, loadData, saveData } from "../data/data.js";
import { createFilter } from "../components/filter.js";
import { createList, render } from "../components/list.js";
import { createSearch } from "../components/search.js";
import { createLearnBtn } from "../components/learn-btn.js";



main();

function main() {
    loadData('sentenceList');
    const sentenceList = getData('sentenceList');
    createSearch('search-input', 'suggestions-list', 'sentence', sentenceList, render, 'sentence');
    createFilter('status', sentenceList, render);
    createLearnBtn('sentenceList');
    createList('sentenceList', sentenceList, ['sentence', 'meaning'], 'form-add-sentence');
    render(null, null);

    window.addEventListener("unload", () => saveData('sentenceList'));
}






