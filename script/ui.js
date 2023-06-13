const ui = {
    idFields: [],
    fieldElements: {},
    btnElements: {},
}

export function createUI(idFields) {
    ui.idFields = [...idFields];
    for (let id of idFields) {
        ui.fieldElements[id] = document.getElementById(id);
    }
}

export function input() {
    const obj = {};
    for (let id of ui.idFields) {
        obj[id] = this.fieldElements[id].value;
    }
    obj['createdAt'] = new Date();
    obj['updatedAt'] = new Date();
    return obj;
}

export function output(obj) {
    for (let id of ui.idFields) {
        ui.fieldElements[id].value = obj[id].value;
    }
}

export function clear() {
    for (let id of ui.idFields) {
        ui.fieldElements[id].value = '';
    }
}