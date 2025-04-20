import { addWordList, getWordList } from "./data-firebase.js";
import { tables } from "./schema.js";

const data = {
  vocabList: [],
  phraseList: [],
  sentenceList: [],
  currentIndex: -1,
};

export function normalizeVocabList(jsonData, vocabList) {
  const now = new Date();
  jsonData = jsonData.map((item, idx) => {
    const newItem = {};

    vocabList.forEach(({ name, type }) => {
      let value = item[name];

      if (value === undefined || value === null || value === "") {
        // Gán giá trị mặc định nếu thiếu
        switch (type) {
          case "string":
            value = "";
            if (name == "status") value = "new";
            break;
          case "number":
            value = idx + 1; // index tăng dần
            break;
          case "date":
            value = now;
            break;
          default:
            value = "";
        }
      } else {
        // Ép kiểu nếu cần
        switch (type) {
          case "number":
            value = Number(value);
            break;
          case "date":
            value = new Date(value);
            break;
          case "string":
            value = String(value).trim();
            break;
        }
      }

      newItem[name] = value;
    });

    return newItem;
  });
  return jsonData;
}

export async function loadData(dataName) {
  // const jsonWordList = localStorage.getItem(dataName);
  const vocabList = await getWordList();
  data[dataName] = vocabList;

  if (data[dataName] == null) data[dataName] = [];
  else {
    if (data[dataName].length > 0) {
      for (const item of data[dataName]) {
        for (const field of tables[dataName]) {
          if (field.type == "date") {
            item[field.name] = new Date(item[field.name]);
          } else if (field.type == "number") {
            item[field.name] = Number(item[field.name]);
          } else if (field.type == "boolean") {
            item[field.name] = Boolean(item[field.name]);
          }
        }
      }
    }
  }
}

export function getData(key, filter = null) {
  console.log(filter);
  if (key in data) {
    if (filter) {
      const returnData = data[key].filter((item) => {
        for (const criteria in filter) {
          // console.log(criteria);
          const value = filter[criteria].toString().toLowerCase()
          if (value == "all" || value == "null") continue;
          if (
            value != item[criteria].toString().toLowerCase()
          )
            return false;
        }
        return true;
      });
      return returnData;
    } else {
      return data[key];
    }
  }
  return null;
}

export function setData(key, value) {
  if (key in data) if (data[key] != "object") data[key] = value;
}

export async function addItemToList(item, listName) {
  const jsonData = normalizeVocabList([item], tables.vocabList);
  await addWordList(jsonData);
    // Hiển thị thông báo thành công bằng sweetalert2
    Swal.fire({
      title: 'Thành công!',
      text: 'Từ vựng đã được thêm thành công.',
      icon: 'success',
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'confirm-btn-green' // Thêm lớp CSS cho nút confirm
      }
    });
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
