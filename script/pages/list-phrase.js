import { getData, loadData, saveData } from "../data/data.js";
import { createFilter } from "../components/filter.js";
import { createList, render } from "../components/list.js";
import { createSearch } from "../components/search.js";
import { createLearnBtn } from "../components/learn-btn.js";



main();

function main() {
    loadData('phraseList');
    const phraseList = getData('phraseList');
    createSearch('search-input', 'suggestions-list', 'phrase', phraseList, render, 'phrase');
    createFilter('status', phraseList, render);
    createLearnBtn('phraseList');
    createList('phraseList', phraseList, ['phrase', 'meaning'], 'form-add-phrase');
    render(null, null);

    window.addEventListener("unload", () => saveData('phraseList'));
}






