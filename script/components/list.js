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
        const itemShow = {...item};
        for (let key in itemShow) {
            if (!keyShow.find((x) => x == key))
                delete itemShow[key];
        }
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
    const index = Number(this.parentElement.getAttribute('index'));
    
    if (index >= 0 && index < state.dataSource.length)
        state.dataSource.splice(indexDelete, 1);

    render();
}

function handleUpdateItem() {
    const index = Number(this.parentElement.getAttribute('index'));
    if (index >= 0 && index < state.dataSource.length) {
        const data = {
            currentIndex: index
        }
        const searchParam = new URLSearchParams(data);
        const quesryString = searchParam.toString();
        window.location.href = state.page + '.html?' + quesryString;
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