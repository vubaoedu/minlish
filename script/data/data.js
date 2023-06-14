const data = {
    vocabList: [],
    currentIndex: -1,
};

export function loadData(dataName) {
    const jsonWordList = localStorage.getItem(dataName);
    data[dataName] = JSON.parse(jsonWordList);
    if (data[dataName] == null)
        data[dataName] = [];
    else {
        if (data[dataName].length > 0) {
            const sample = data[dataName][0];
            const dateKeys = [];
            for (let key in sample) {
                if (!isNaN(Date.parse(sample[key])))
                    dateKeys.push(key);
            }
            for (let item of data[dataName]) {
                for (let key of dateKeys) {
                    item[key] = new Date(item[key]);
                }
            }
        }
    }
}

export function getData(key) {
    if (key in data)
        return data[key]
    return null;
}

export function setData(key, value) {
    if (key in data)
        if (data[key] != 'object')
            data[key] = value;
}

export function addItemToList(item, listName) {
    data[listName].push(item);
    console.log(data[listName]);
}

export function updateItemList(item, index, listName) {
    if (index >= 0 && index < data[listName].length) {
        data[listName][index] = item;
        return true;
    }
    return false;
}

export function saveData(key) {
    console.log(data);
    if (key in data) {
        const json = JSON.stringify(data[key]);
        localStorage.setItem(key, json);
    }
}