import { getCategoryFilter, getCurrentFilter } from "./filter.js";

export function createLearnBtn(dataName = '') {
    const learnBtn = document.getElementById('learn');
    learnBtn.addEventListener('click', () => {
        const data = {
            dataName: dataName,
            status: getCurrentFilter(),
            category: getCategoryFilter(),
        }
        const searchParam = new URLSearchParams(data);
        const queryString = searchParam.toString();
        console.log('queryString', queryString);
        window.location.href = 'learn.html?' + queryString;
    });
}