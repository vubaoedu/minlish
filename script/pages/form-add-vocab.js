import { getData, loadData, saveData } from "../data/data.js";
import { createForm } from "../components/form.js";
import { getFieldNameList, tables } from "../data/schema.js";
import { addWordList } from "../data/data-firebase.js";

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("excelFile");

  input.addEventListener("change", function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      let jsonData = XLSX.utils.sheet_to_json(sheet);

      // Chuẩn hoá dữ liệu
      const vocabList = tables.vocabList;
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
                if (name == 'status')
                  value = 'new';
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
      
      addWordList(jsonData);
    };

    reader.readAsArrayBuffer(file);
  });
});

function main() {
  loadData("vocabList");
  const vocabList = getData("vocabList");
  const fieldNameList = getFieldNameList("vocabList");
  createForm(
    fieldNameList,
    [],
    ["btnAdd", "btnUpdate"],
    vocabList,
    "vocabList",
    "word",
    { status: "New" }
  );
  window.addEventListener("unload", () => saveData("vocabList"));
}

main();
