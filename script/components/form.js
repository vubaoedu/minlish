import { addItemToList, getData, setData, updateItemList } from '../data/data.js';
import { createUI, getElement, ui } from './ui.js';

const state = {
    dataSource: null,
    dataSourceName: '',
    primaryKey: '',
    defaultValue: null,
};

export function createForm(idInputs = [], idOutputs = [], idButtons = [], dataSource = null, dataSourceName = '', primaryKey = '', defaultValue = null) {
    state.dataSource = dataSource;
    state.dataSourceName = dataSourceName;
    state.primaryKey = primaryKey;
    state.defaultValue = defaultValue;

    createUI(idInputs, idOutputs, idButtons);
    const addButton = getElement(idButtons[0]);
    addButton.addEventListener("click", addItem);
    const updateButton = getElement(idButtons[1]);
    updateButton.addEventListener("click", updateItem);

    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    
    if (params.get('currentIndex') != null) {
        const currentIndex = Number(params.get('currentIndex'));
        setData('currentIndex', currentIndex);
        changeDisplay('btnAdd', 'none');
        changeDisplay('btnUpdate', 'block');
        if (currentIndex >= 0 && currentIndex < dataSource.length) {
            output(dataSource[currentIndex]);
        }
        else {
            clear();
        }
    }
    else {
        changeDisplay('btnAdd', 'block');
        changeDisplay('btnUpdate', 'none');
    }
        
    
}

export function input(isCreation = true) {
    const currentIndex = getData('currentIndex');
    let obj = {};
    if (currentIndex != -1)
        obj = state.dataSource[currentIndex];
    for (let id in ui.inputElements) {
        obj[id] = ui.inputElements[id].value;
    }
    obj['id'] = state.dataSource.length;
    if (isCreation)
        obj['createdAt'] = new Date();
    obj['updatedAt'] = new Date();
    return obj;
}

export function output(obj) {
    for (let id in ui.inputElements) {
        ui.inputElements[id].value = obj[id];
    }
}

export function clear(isShowDefaultValue = true) {
    for (let id in ui.inputElements) {
        ui.inputElements[id].value = '';
    }
    if (isShowDefaultValue) {
        for (let id in state.defaultValue) {
            ui.inputElements[id].value = state.defaultValue[id];
        }
    }
}

export function changeDisplay(id, display) {
    let element = null;
    if (id in ui.inputElements) {
        element = ui.inputElements[id];
    }
    else if (id in ui.btnElements) {
        element = ui.btnElements[id];
    }
    else {
        return;
    }
    element.style.display = display;
}

export function addItem() {
    const {dataSource, dataSourceName, primaryKey} = state;
    const newItem = input();
    

    let indexFinded = -1;

    dataSource.find((item, index) => {
        if (item[primaryKey] == newItem[primaryKey]) {
            indexFinded = index;
        }
    });

    if (indexFinded == -1) {
        addItemToList(newItem, dataSourceName);
        clear();
        alert(`Đã thêm thành công.`);
    }
    else {
        output(dataSource[indexFinded]);
        alert(`Đã tồn tại. ID: ${indexFinded}`);
    }
}

export function updateItem() {
    const item = input(false);
    const currentIndex = getData('currentIndex');
    if (updateItemList(item, currentIndex, state.dataSourceName)) {
        alert('Cập nhật thành công.');
    }
    else {
        alert('Cập nhật thất bại.');
    }
}