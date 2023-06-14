import { getData, loadData, saveData } from "../data/data.js";
import { createFilter } from "../components/filter.js";
import { createList, render } from "../components/list.js";
import { createSearch } from "../components/search.js";



main();

function main() {
    loadData('vocabList');
    const vocabList = getData('vocabList');
    createSearch('search-input', 'suggestions-list', 'word', vocabList, render, 'word');
    createFilter('status', vocabList, render);
    createList('vocabList', vocabList, ['word', 'meaning', 'pronounce', 'wordType'], 'form-add-vocab');
    render(null, null);

    window.addEventListener("unload", () => saveData('vocabList'));
}






