export const tables = {
    vocabList: [
        { name: 'word', type: 'string',  inUI: true},
        { name: 'wordType', type: 'string',  inUI: true},
        { name: 'pronunciation', type: 'string',  inUI: true},
        { name: 'description', type: 'string',  inUI: true},
        { name: 'meaning', type: 'string',  inUI: true},
        { name: 'note', type: 'string',  inUI: true},
        { name: 'example', type: 'string', inUI: true},
        { name: 'collocation', type: 'string', inUI: true},
        { name: 'relatedWord', type: 'string', inUI: true},
        { name: 'category', type: 'string', inUI: true},
        { name: 'status', type: 'string',  inUI: false},
        { name: 'index', type: 'string',  inUI: false},
        { name: 'createdAt', type: 'date',  inUI: false},
        { name: 'updatedAt', type: 'date',  inUI: false},
    ],
    phraseList: [
        { name: 'id', type: 'number', inUI: false},
        { name: 'phrase', type: 'string',  inUI: true},
        { name: 'meaning', type: 'string',  inUI: true},
        { name: 'status', type: 'string',  inUI: true},
        { name: 'createdAt', type: 'date',  inUI: false},
        { name: 'updatedAt', type: 'date',  inUI: false},
    ],
    sentenceList: [
        { name: 'id', type: 'number', inUI: false},
        { name: 'sentence', type: 'string',  inUI: true},
        { name: 'meaning', type: 'string',  inUI: true},
        { name: 'status', type: 'string',  inUI: true},
        { name: 'createdAt', type: 'date',  inUI: false},
        { name: 'updatedAt', type: 'date',  inUI: false},
    ],
};

export const valueDomain = {
    status: ['new', 'day', 'week', 'month', 'quarter', 'year'],
};

export function getFieldNameList(tableName, inUI = true) {
    const table = tableName in tables ? tables[tableName] : null;
    const fieldNameList = [];
    if (table) {
        for (let field of table) {
            if (field.inUI == inUI)
                fieldNameList.push(field.name);
        }
    }
    return fieldNameList;
}