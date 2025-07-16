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
    const queryString = window.location.search;
  const params = new URLSearchParams(queryString);

  const category = params.get("category");
  const status = params.get("status");

  if (status) {
    const select = document.getElementById("status");
    select.value = status;
  }

  let param = {category, status};

    getWordList(param)
    .then((vocabList) => {
        createSearch('search-input', 'suggestions-list', 'word', vocabList, render, 'word');
        createFilter('status', status?status:'all', category, vocabList, render);
        createLearnBtn('vocabList');
        createList('vocabList', vocabList, ['word', 'meaning', 'pronunciation', 'wordType', 'description', 'example', 'collocation'], 'form-add-vocab');
        render(null, null);
        
        // window.addEventListener("unload", () => saveData('vocabList'));

        const exportBtn = document.getElementById('export-to-excel');
        exportBtn.addEventListener('click', () => {
            exportToExcel(vocabList)
        });
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

function exportToExcel(vocabList, fileName = 'vocab_list.xlsx') {
    const worksheet = XLSX.utils.json_to_sheet(vocabList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "VocabList");
  
    XLSX.writeFile(workbook, fileName);
}