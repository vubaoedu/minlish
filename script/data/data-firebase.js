// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  where,
  doc,
  orderBy,
  limit,
  deleteDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { tables } from "./schema.js";

const accessKey = 'N4gTD5AS9xdfRTjYWW8cgdHGI0Q99PKJIBpJqNgbeBM';  // Lấy API key từ Unsplash

const firebaseConfig = {
  apiKey: "AIzaSyDXJ61nJN7prPofha4wnS0UEu-67T8l0yQ",
  authDomain: "minlish-3d325.firebaseapp.com",
  projectId: "minlish-3d325",
  storageBucket: "minlish-3d325.firebasestorage.app",
  messagingSenderId: "490758208209",
  appId: "1:490758208209:web:6742fe77a9a8c6ed0523f0",
  measurementId: "G-GXFRX2HCHS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and get a reference to the service
const db = getFirestore(app);

export async function getWordList({ category, status } = {}) {
  const wordListCollection = collection(db, "vocabulary");

  // Xây dựng mảng các điều kiện where
  const conditions = [];
  if (category) {
    conditions.push(where("category", "==", category));
  }
  if (status) {
    conditions.push(where("status", "==", status));
  }

  // Tạo query có thể bao gồm các điều kiện
  const q = query(wordListCollection, ...conditions, orderBy("index"));

  const wordListSnapshot = await getDocs(q);
  const desiredOrder = tables.vocabList.map(field => field.name);

  const wordList = wordListSnapshot.docs.map((doc) => {
    const data = doc.data();
    const ordered = {};
    for (const key of desiredOrder) {
      if (key in data) ordered[key] = data[key];
    }
    return ordered;
  });

  return wordList;
}

// export async function getWordList() {
//   const wordListCollection = collection(db, "vocabulary");
//   const q = query(wordListCollection, orderBy("index"));
//   const wordListSnapshot = await getDocs(q);
//   const desiredOrder = tables.vocabList.map(field => field.name);
 
//   const wordList = wordListSnapshot.docs.map((doc) => {
//     const data = doc.data();
//     const ordered = {};
//     for (const key of desiredOrder) {
//       if (key in data) ordered[key] = data[key];
//     }
//     return ordered;
//   });
//   return wordList;
// }

async function getImageFromUnsplash(word) {
  const query = encodeURIComponent(word);
  const apiUrl = `https://api.unsplash.com/search/photos?query=${query}&client_id=${accessKey}&per_page=1`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    } else {
      console.warn("No image found for:", word);
      return null;
    }
  } catch (error) {
    console.error("Error fetching the image:", error);
    return null;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export async function addWordList(words) {
  const q = query(
    collection(db, "vocabulary"),
    orderBy("index", "desc"),
    limit(1)
  );
  const snapshot = await getDocs(q);
  let currentIndex = 0;
  if (!snapshot.empty) {
    currentIndex = snapshot.docs[0].data().index + 1; // Max index
  }
  

  for (const w of words) {
    const imgURL = await getImageFromUnsplash(w.word);
    console.log(w, imgURL);
    await addDoc(collection(db, "vocabulary"), {
      ...w,
      imgURL: imgURL,
      index: currentIndex,
    });
    currentIndex++;
    await sleep(500);
  }

  return 1;
}

export async function deleteWord(word) {
  const q = query(collection(db, "vocabulary"), where("word", "==", word));
  const snapshot = await getDocs(q);

  for (const d of snapshot.docs) {
    await deleteDoc(doc(db, "vocabulary", d.id));
  }

}

/**
 * Cập nhật một field của từ vựng theo index
 * @param {number} index - Index của từ vựng
 * @param {string} fieldName - Tên field cần cập nhật (VD: "note")
 * @param {*} newValue - Giá trị mới của field
 */
export async function updateWordByIndex(index, fieldName, newValue) {
  console.log(fieldName, newValue, index);
  try {
    const q = query(collection(db, "vocabulary"), where("index", "==", index));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.warn(`Không tìm thấy từ có index = ${index}`);
      return;
    }

    const docRef = snapshot.docs[0].ref; // Giả sử index là duy nhất
    
    
    await updateDoc(docRef, {
      [fieldName]: newValue,
      updatedAt: new Date(), // Optional: tự động cập nhật thời gian sửa
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật:", error);
  }
}

export async function loadCategories() {
  const vocabRef = collection(db, "vocabulary");
  const snapshot = await getDocs(vocabRef);

  const categoryMap = new Map();

  snapshot.forEach(doc => {
    const data = doc.data();
    const cat = data.category || "Khác";
    if (!categoryMap.has(cat)) categoryMap.set(cat, []);
    categoryMap.get(cat).push(data.word);
  });
  return categoryMap;
}

export async function loadStatus() {
  const vocabRef = collection(db, "vocabulary");
  const snapshot = await getDocs(vocabRef);

  const statusMap = new Map();

  snapshot.forEach(doc => {
    const data = doc.data();

    const status = data.status || "new";
    if (!statusMap.has(status)) statusMap.set(status, []);
    statusMap.get(status).push(data.word);
  });

  return statusMap;
}
