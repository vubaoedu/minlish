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

export async function getWordList() {
  const wordListCollection = collection(db, "vocabulary");
  const q = query(wordListCollection, orderBy("index"));
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
    await addDoc(collection(db, "vocabulary"), {
      ...w,
      index: currentIndex,
    });
    currentIndex++;
  }

  return 1;
}

export async function deleteWord(word) {
  const q = query(collection(db, "vocabulary"), where("word", "==", word));
  const snapshot = await getDocs(q);

  for (const d of snapshot.docs) {
    console.log("Xoá:", d.id);
    await deleteDoc(doc(db, "vocabulary", d.id));
  }

  // snapshot.forEach(async (d) => {
  //   console.log(d.id);
  //   await deleteDoc(doc(db, "vocabulary", d.id));
  // });
}

/**
 * Cập nhật một field của từ vựng theo index
 * @param {number} index - Index của từ vựng
 * @param {string} fieldName - Tên field cần cập nhật (VD: "note")
 * @param {*} newValue - Giá trị mới của field
 */
export async function updateWordByIndex(index, fieldName, newValue) {
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

    console.log(`Đã cập nhật "${fieldName}" của từ index ${index} thành:`, newValue);
  } catch (error) {
    console.error("Lỗi khi cập nhật:", error);
  }
}