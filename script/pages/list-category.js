import { loadCategories, loadStatus } from "../data/data-firebase.js";



async function renderCateggory() {
    const categoryContainer = document.getElementById("category-list");
    const categoryMap = await loadCategories();
    categoryMap.forEach((words, category) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <h3>${category}</h3>
          <p>${words.length} từ</p>
        `;
        card.onclick = () => {
          window.location.href = `list-vocab.html?category=${encodeURIComponent(category)}`;
        };
        categoryContainer.appendChild(card);
      });
}

async function renderStatus() {
    const statusContainer = document.getElementById("status-list");
    const statusMap = await loadStatus();
    statusMap.forEach((words, status) => {
        const label = getStatusLabel(status);
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <h3>${label}</h3>
          <p>${words.length} từ</p>
        `;
        card.onclick = () => {
          window.location.href = `list-vocab.html?status=${encodeURIComponent(status)}`;
        };
        statusContainer.appendChild(card);
      });
}

// Helper để chuyển status -> tên dễ hiểu
function getStatusLabel(status) {
    switch (status) {
      case "new": return "🆕 New";
      case "day": return "📅 Day Memory";
      case "week": return "🗓️ Week Memory";
      case "month": return "📆 Month Memory";
      case "quarter": return "📘 Quarter Memory";
      case "year": return "📙 Year Memory";
      default: return status;
    }
  }

async function main() {
    await renderCateggory();
    await renderStatus();

}

main();