export const ui = {
    inputElements: {},
    outputElements: {},
    btnElements: {},
};

export function createUI(idInputs = [], idOutputs = [], idButtons = []) {
    for (let id of idInputs) {
        ui.inputElements[id] = document.getElementById(id);
    }
    for (let id of idOutputs) {
        ui.outputElements[id] = document.getElementById(id);
    }
    for (let id of idButtons) {
        ui.btnElements[id] = document.getElementById(id);
    }
}

export function getElement(id) {
    let element = null;
    if (id in ui.inputElements) {
        element = ui.inputElements[id];
    }
    else if (id in ui.btnElements) {
        element = ui.btnElements[id];
    }
    else if (id in ui.outputElements) {
        element = ui.outputElements[id];
    }
    return element;
}