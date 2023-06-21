import { getData, loadData, saveData } from "../data/data.js";
import { createForm } from "../components/form.js";
import { getFieldNameList } from "../data/schema.js";



function main() {
    loadData('phraseList');
    const phraseList = getData('phraseList');
    const fieldNameList = getFieldNameList('phraseList');
    createForm(fieldNameList, [], ['btnAdd', 'btnUpdate'], phraseList, 'phraseList', 'phrase', {status: 'New'});
    window.addEventListener("unload", () => saveData('phraseList'));
}

main();