import { getData, loadData, normalizeVocabList, saveData } from "../data/data.js";
import { createForm } from "../components/form.js";
import { getFieldNameList, tables } from "../data/schema.js";
import { addWordList } from "../data/data-firebase.js";


document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("excelFile");
  const btnAdd = document.getElementById("addVocabFromFile");

  input.addEventListener("change", function (e) {
    const fileNameDisplay = document.getElementById('file-name');
    const fileName = input.files[0]?.name || "Chưa chọn file";
    fileNameDisplay.textContent = fileName;
    const file = e.target.files[0];
    btnAdd.onclick = function() {
      const reader = new FileReader();

    reader.onload = async function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      let jsonData = XLSX.utils.sheet_to_json(sheet);

      // Chuẩn hoá dữ liệu
      const vocabList = tables.vocabList;
      jsonData = normalizeVocabList(jsonData, vocabList);
      
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
    };

    reader.readAsArrayBuffer(file);
    }
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
  // window.addEventListener("unload", () => saveData("vocabList"));
}

main();
