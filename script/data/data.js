import { tables } from "./schema.js";

const data = {
    vocabList: [],
    phraseList: [],
    sentenceList: [],
    currentIndex: -1,
};

export function loadData(dataName) {
    const jsonWordList = localStorage.getItem(dataName);
    data[dataName] = JSON.parse(jsonWordList);
    if (data[dataName] == null)
        data[dataName] = [];
    else {
        if (data[dataName].length > 0) {
            for (const item of data[dataName]) {
                for (const field of tables[dataName]) {
                    if (field.type == 'date') {
                        item[field.name] = new Date(item[field.name]);
                    }
                    else if (field.type == 'number') {
                        item[field.name] = Number(item[field.name]);
                    }
                    else if (field.type == 'boolean') {
                        item[field.name] = Boolean(item[field.name]);
                    }
                }
            }
        }
    }
}

export function getData(key, filter = null) {
    
    if (key in data)
    {
        if (filter) {
            const returnData =  data[key].filter((item) => {
                for (const criteria in filter) {
                    if (filter[criteria].toString().toLowerCase() == 'all')
                        continue;
                    if (filter[criteria].toString().toLowerCase() != item[criteria].toString().toLowerCase())
                        return false;
                }
                return true;
            });
            return returnData;
        }
        else {
            return data[key]
        }
    }
    return null;
}

export function setData(key, value) {
    if (key in data)
        if (data[key] != 'object')
            data[key] = value;
}

export function addItemToList(item, listName) {
    data[listName].push(item);
}

export function updateItemList(item, index, listName) {
    if (index >= 0 && index < data[listName].length) {
        data[listName][index] = item;
        return true;
    }
    return false;
}

export function saveData(key) {
    if (key in data) {
        const json = JSON.stringify(data[key]);
        localStorage.setItem(key, json);
    }
}