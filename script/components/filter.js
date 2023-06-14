import { createUI, getElement } from "./ui.js";

let idElements = {
    idInputElement: '', 
};

const state = {
    currentFilter: 'all',
    dataSource: null,
    renderFn: null,
};

export function createFilter(idInputElement, dataSource = null, renderFn = null) {
    idElements.idInputElement = idInputElement;
    state.dataSource = dataSource;
    state.renderFn = renderFn;
    createUI([idInputElement]);
    const filterInput = getElement(idInputElement);
    filterInput.addEventListener("change", handleFilterChange);
}

export function handleFilterChange(event) {
    state.currentFilter = event.target.value;
    const criteria = idElements.idInputElement;
    const filter = {};
    filter[criteria] = state.currentFilter;
    state.renderFn(null, filter);
}