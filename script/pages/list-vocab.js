import { getData, loadData, saveData } from "../data/data.js";
import { addWordList, getWordList } from "../data/data-firebase.js";
import { createFilter } from "../components/filter.js";
import { createList, render } from "../components/list.js";
import { createSearch } from "../components/search.js";
import { createLearnBtn } from "../components/learn-btn.js";



main();

function test() {
   
}

function main() {
 
    getWordList()
    .then((vocabList) => {
        createSearch('search-input', 'suggestions-list', 'word', vocabList, render, 'word');
        createFilter('status', vocabList, render);
        createLearnBtn('vocabList');
        createList('vocabList', vocabList, ['word', 'meaning', 'pronunciation', 'wordType'], 'form-add-vocab');
        render(null, null);
        
        // window.addEventListener("unload", () => saveData('vocabList'));
    })
    .catch((error) => {
    console.error("Error getting words: ", error);
    });
    
    // loadData('vocabList');
    // const vocabList = getData('vocabList');
    // createSearch('search-input', 'suggestions-list', 'word', vocabList, render, 'word');
    // createFilter('status', vocabList, render);
    // createLearnBtn('vocabList');
    // createList('vocabList', vocabList, ['word', 'meaning', 'pronounce', 'wordType'], 'form-add-vocab');
    // render(null, null);
    
    // window.addEventListener("unload", () => saveData('vocabList'));
}