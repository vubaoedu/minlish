import { deleteWord } from "../data/data-firebase.js";
import { createUI, getElement } from "./ui.js";

let idElements = {
    idListElement: '', 
};

const state = {
    dataSource: null,
    keyShow: [],
    page: '',
};

export function createList(idListElement, dataSource = null, keyShow = [], page = '') {
    idElements.idListElement = idListElement;
    state.dataSource = dataSource;
    state.keyShow = keyShow;
    state.page = page;
    createUI([], [idListElement]);
}

export function render(search = null, filter = null) {
    let listShow = state.dataSource;
    const keyShow = state.keyShow;

    if (search) {
        for (let criteria in search) {
            listShow = listShow.filter((item) => item[criteria].toLowerCase().includes(search[criteria]));
        }
    }
    if (filter) {
        for (let criteria in filter) {
            if (filter[criteria] != 'all')
                listShow = listShow.filter((item) => item[criteria].toLowerCase().includes(filter[criteria]));
        }
    }
    

    clearList();

    listShow.forEach((item, index) => {
        let itemShow = {...item};
        console.log(itemShow);
        // console.log(keyShow);
        const keysToDelete = [];
        for (let key in itemShow) {
            if (!keyShow.find((x) => x == key))
                keysToDelete.push(key);
        }
        // console.log(keysToDelete);
        const newObj = Object.keys(itemShow)
            .filter(key => !keysToDelete.includes(key)) // chỉ giữ key KHÔNG bị xoá
            .reduce((acc, key) => {
                acc[key] = itemShow[key];
                return acc;
            }, {});
        itemShow = newObj;
        // console.log(newObj);
        const li = createItemElement(itemShow, [
            {text: 'Delete', handler: handleDeleteItem},
            {text: 'Update', handler: handleUpdateItem},
            {text: 'Detail', handler: handleDetailItem}
        ]);

        li.setAttribute('index', index);
        const listElement = getElement(idElements.idListElement);
        listElement.appendChild(li);
    });
}

export function clearList() {
    const ul = getElement(idElements.idListElement);
    const lis = ul.children;
    while (lis.length > 0) {
        lis[lis.length - 1].remove();
    }
}

function createItemElement(item, actions = []) {
    const li = document.createElement('li');

    for (let id in item) {
        const div = document.createElement('div');
        div.classList.add(id);
        div.innerHTML = item[id];
        li.appendChild(div);
    }

    for (let action of actions) {
        const span = document.createElement('span');
        span.classList.add('action');
        span.textContent = action.text;
        span.addEventListener('click', action.handler);
        li.appendChild(span);
    }
    return li;
}

function handleDeleteItem() {
    // console.log(this.parentElement.children[0].innerHTML);
    deleteWord(this.parentElement.children[0].innerHTML);

    const index = Number(this.parentElement.getAttribute('index'));
    
    if (index >= 0 && index < state.dataSource.length)
        state.dataSource.splice(index, 1);

    render();
}

function handleUpdateItem() {
    const index = Number(this.parentElement.getAttribute('index'));
    if (index >= 0 && index < state.dataSource.length) {
        const data = {
            currentIndex: index
        }
        const searchParam = new URLSearchParams(data);
        const queryString = searchParam.toString();
        window.location.href = state.page + '.html?' + queryString;
    }
}
function handleDetailItem() {
    const index = Number(this.parentElement.getAttribute('index'));
    
    if (index >= 0 && index < state.dataSource.length) {
        const item = state.dataSource[index];
        let info = '';
        for (let key in item) {
            info += `- ${key}: ${item[key]}\n`;
        }
        alert(info);
    }
}