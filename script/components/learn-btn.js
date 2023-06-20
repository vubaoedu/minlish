import { getCurrentFilter } from "./filter.js";

export function createLearnBtn(dataName = '') {
    const learnBtn = document.getElementById('learn');
    learnBtn.addEventListener('click', () => {
        const data = {
            dataName: dataName,
            status: getCurrentFilter(),
        }
        const searchParam = new URLSearchParams(data);
        const queryString = searchParam.toString();
        window.location.href = 'learn.html?' + queryString;
    });
}