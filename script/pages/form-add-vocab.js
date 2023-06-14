import { getData, loadData, saveData } from "../data/data.js";
import { vocabFields } from "../data/schema.js";
import { createForm } from "../components/form.js";



function main() {
    loadData('vocabList');
    const vocabList = getData('vocabList');
    createForm(vocabFields, [], ['btnAdd', 'btnUpdate'], vocabList, 'vocabList', 'word', {status: 'New'});
    window.addEventListener("unload", () => saveData('vocabList'));
}

main();