import { getData, loadData, saveData } from "../data/data.js";
import { createForm } from "../components/form.js";
import { getFieldNameList } from "../data/schema.js";



function main() {
    loadData('vocabList');
    const vocabList = getData('vocabList');
    const fieldNameList = getFieldNameList('vocabList');
    createForm(fieldNameList, [], ['btnAdd', 'btnUpdate'], vocabList, 'vocabList', 'word', {status: 'New'});
    window.addEventListener("unload", () => saveData('vocabList'));
}

main();