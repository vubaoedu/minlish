import { getData, loadData, saveData } from "../data/data.js";
import { createFilter } from "../components/filter.js";
import { createList, render } from "../components/list.js";
import { createSearch } from "../components/search.js";
import { createUI, getElement, ui } from "../components/ui.js";
import { valueDomain } from "../data/schema.js";

const state = {
    dataSource: null,
    currentIndex: -1,
    isFront: true,
}

main();

function main() {
    createUI([], ['main-content', 'sub-content', 'meaning-content'], ['previous', 'flip', 'next', 'forget', 'remember']);

    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    
    let dataName = params.get('dataName');
    const status = params.get('status');
    
    if (dataName && getData(dataName)) {
        loadData(dataName);
        if (status) {
            state.dataSource = getData(dataName, {status: status});
            if (state.dataSource.length > 0) {
                state.currentIndex = 0;

                const previousBtn = getElement('previous');
                previousBtn.addEventListener('click', () => {
                    state.isFront = true;
                    state.currentIndex--;
                    if (state.currentIndex < 0)
                        state.currentIndex = state.dataSource.length - 1;
                    show(dataName);
                });

                const nextBtn = getElement('next');
                nextBtn.addEventListener('click', () => {
                    state.isFront = true;
                    state.currentIndex++;
                    if (state.currentIndex >= state.dataSource.length)
                        state.currentIndex = 0;
                    show(dataName);
                });

                const flipBtn = getElement('flip');
                flipBtn.addEventListener('click', () => {
                    if (state.isFront)
                        show(dataName, true);
                    else
                        show(dataName, false);
                    state.isFront = !state.isFront;
                });
                
                
                const forgetBtn = getElement('forget');
                forgetBtn.addEventListener('click', () => {
                    let newStaus = state.dataSource[state.currentIndex].status;
                    const statusValueDomain = valueDomain['status'];
                    let index = -1;
                    for (let i = 0; i < statusValueDomain.length; i++) {
                        if (statusValueDomain[i] == newStaus) {
                            index = i;
                            break;
                        }
                    }
                    if (index > 0) {
                        newStaus = statusValueDomain[index-1];
                    }
                    state.dataSource[state.currentIndex].status = newStaus;
                    
                });

                const rememberBtn = getElement('remember');
                rememberBtn.addEventListener('click', () => {
                    let newStaus = state.dataSource[state.currentIndex].status;
                    const statusValueDomain = valueDomain['status'];
                    let index = -1;
                    for (let i = 0; i < statusValueDomain.length; i++) {
                        if (statusValueDomain[i] == newStaus) {
                            index = i;
                            break;
                        }
                    }
                    if (index < statusValueDomain.length - 1) {
                        newStaus = statusValueDomain[index+1];
                    }
                    state.dataSource[state.currentIndex].status = newStaus;
                });

                show(dataName);
            } 
        }
    }  

    window.addEventListener("unload", () => saveData(dataName));
}

function show(dataName, showMeaing = false) {
    switch (dataName) {
        case 'vocabList':
            showContent('word', 'pronounce', showMeaing);
            break;
        case 'phraseList':
            showContent('phrase', '', showMeaing);
            break;
        case 'sentenceList':
            showContent('sentence', '', showMeaing);
            break;
    }
}

function showContent(keyMain, keySub = '', showMeaning = false) {
    const {dataSource, currentIndex} = state;
    const mainContentElement = getElement('main-content');
    const subContentElement = getElement('sub-content');
    const meaningContentElement = getElement('meaning-content');
    mainContentElement.innerHTML = dataSource[currentIndex][keyMain];
    subContentElement.innerHTML = keySub=='' ? '' : dataSource[currentIndex][keySub];
    if (showMeaning)
        meaningContentElement.innerHTML = dataSource[currentIndex]['meaning'];
    else
        meaningContentElement.innerHTML = '';
}