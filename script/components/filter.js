import { createUI, getElement } from "./ui.js";

let idElements = {
    idInputElement: '', 
};

const state = {
    currentFilter: 'all', // status
    categoryFilter: '',
    dataSource: null,
    renderFn: null,
    
};

export function createFilter(idInputElement, currentFilter='all', categoryFilter='', dataSource = null, renderFn = null) {
    console.log('currentFilter', currentFilter);
    idElements.idInputElement = idInputElement;
    state.currentFilter = currentFilter;
    state.categoryFilter = categoryFilter;
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

export function getCurrentFilter() {
    return state.currentFilter;
}

export function getCategoryFilter() {
    return state.categoryFilter;
}