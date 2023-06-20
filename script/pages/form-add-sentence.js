import { getData, loadData, saveData } from "../data/data.js";
import { createForm } from "../components/form.js";
import { getFieldNameList } from "../data/schema.js";



function main() {
    loadData('sentenceList');
    const sentenceList = getData('sentenceList');
    const fieldNameList = getFieldNameList('sentenceList');
    createForm(fieldNameList, [], ['btnAdd', 'btnUpdate'], sentenceList, 'sentenceList', 'sentence', {status: 'New'});
    window.addEventListener("unload", () => saveData('sentenceList'));
}

main();