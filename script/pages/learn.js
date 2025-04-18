import { getData, loadData, saveData } from "../data/data.js";
import { createFilter } from "../components/filter.js";
import { createList, render } from "../components/list.js";
import { createSearch } from "../components/search.js";
import { createUI, getElement, ui } from "../components/ui.js";
import { tables, valueDomain } from "../data/schema.js";
import { getWordList, updateWordByIndex } from "../data/data-firebase.js";

const state = {
  dataSource: null,
  currentIndex: -1,
  isFront: true,
  autoPlay: false,
  intervalId: null,
};

main();

async function main() {
  createUI(
    [],
    ["main-content", "sub-content", "meaning-content"],
    ["previous", "flip", "next", "forget", "remember"]
  );

  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);

  let dataName = params.get("dataName");
  const status = params.get("status");

  function startAutoPlay() {
    if (state.intervalId) return; // tránh tạo nhiều interval
    state.intervalId = setInterval(() => {
      goToNextWord();
    }, 5000); // 5 giây
  }

  function stopAutoPlay() {
    clearInterval(state.intervalId);
    state.intervalId = null;
  }

  function goToNextWord() {
    state.currentIndex++;
    if (state.currentIndex >= state.dataSource.length) {
      state.currentIndex = 0;
    }
    show(dataName);

    const word = state.dataSource[state.currentIndex]["word"];
    let textToSpeak = [
        { text: word, lang: "en-US" },
      ];
    if (state.autoPlay == true) {
      if (state.isFront) show(dataName, true);
      else show(dataName, false);
      state.isFront = !state.isFront;
      const meaning = state.dataSource[state.currentIndex]["meaning"];
      const example = state.dataSource[state.currentIndex]["example"];
      textToSpeak = [
        ...textToSpeak,
        { text: meaning, lang: "vi-VN" },
        { text: example, lang: "en-US" },
      ]
    }
    speakSequence(textToSpeak);
  }

  if (dataName) {
    await loadData(dataName);
    if (status) {
      state.dataSource = getData(dataName, { status: status });
      if (state.dataSource.length > 0) {
        state.currentIndex = 0;

        const previousBtn = getElement("previous");
        previousBtn.addEventListener("click", () => {
          state.isFront = true;
          state.currentIndex--;
          if (state.currentIndex < 0)
            state.currentIndex = state.dataSource.length - 1;
          show(dataName);
        });

        const nextBtn = getElement("next");
        nextBtn.addEventListener("click", () => {
            state.isFront = false;
          goToNextWord();
        });

        const flipBtn = getElement("flip");
        flipBtn.addEventListener("click", () => {
          if (state.isFront) show(dataName, true);
          else show(dataName, false);
          state.isFront = !state.isFront;
        });

        const forgetBtn = getElement("forget");
        forgetBtn.addEventListener("click", () => {
          let newStaus = state.dataSource[state.currentIndex].status;
          const statusValueDomain = valueDomain["status"];
          let index = -1;
          for (let i = 0; i < statusValueDomain.length; i++) {
            if (statusValueDomain[i] == newStaus) {
              index = i;
              break;
            }
          }
          if (index > 0) {
            newStaus = statusValueDomain[index - 1];
          }
          state.dataSource[state.currentIndex].status = newStaus;
          updateWordByIndex(state.currentIndex, "status", newStaus);
          nextBtn.click();
        });

        const rememberBtn = getElement("remember");
        rememberBtn.addEventListener("click", () => {
          let newStaus = state.dataSource[state.currentIndex].status;
          const statusValueDomain = valueDomain["status"];
          let index = -1;
          for (let i = 0; i < statusValueDomain.length; i++) {
            if (statusValueDomain[i] == newStaus) {
              index = i;
              break;
            }
          }
          if (index < statusValueDomain.length - 1) {
            newStaus = statusValueDomain[index + 1];
          }
          state.dataSource[state.currentIndex].status = newStaus;
          updateWordByIndex(state.currentIndex, "status", newStaus);
          nextBtn.click();
        });

        show(dataName);
      }
    }
  }

  document
    .getElementById("auto-play-toggle")
    .addEventListener("change", (e) => {
      state.autoPlay = e.target.checked;
      console.log('e.target.checked', e.target.checked);
      if (state.autoPlay) {
        startAutoPlay();
      } else {
        stopAutoPlay();
      }
    });

  // window.addEventListener("unload", () => saveData(dataName));
}

function show(dataName, showMeaing = false) {
  switch (dataName) {
    case "vocabList":
      const keySub = [
        "wordType",
        "pronunciation",
        "meaning",
        "note",
        "example",
        "collocation",
        "relatedWord",
      ];

      showContent("word", keySub, showMeaing);
      break;
    case "phraseList":
      showContent("phrase", [], showMeaing);
      break;
    case "sentenceList":
      showContent("sentence", [], showMeaing);
      break;
  }
}
function speak(text) {
  // Nếu đang đọc, dừng lại
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.9; // tốc độ đọc chậm một chút cho dễ nghe

  speechSynthesis.speak(utterance);
}

function speakSequence(texts) {
  if (!Array.isArray(texts) || texts.length === 0) return;

  let index = 0;

  function speakNext() {
    if (index >= texts.length) return;

    const { text, lang } = texts[index];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1;

    utterance.onend = () => {
      index++;
      speakNext(); // đọc đoạn tiếp theo sau khi đoạn trước kết thúc
    };

    speechSynthesis.speak(utterance);
  }

  speechSynthesis.cancel();
  speakNext();
}
function showContent(keyMain, keySub = [], showMeaning = false) {
  const { dataSource, currentIndex } = state;
  const mainContentElement = getElement("main-content");
  const subContentElement = getElement("sub-content");
  const meaningContentElement = getElement("meaning-content");
  mainContentElement.innerHTML = dataSource[currentIndex][keyMain];
  console.log('dataSource', dataSource);
  console.log('currentIndex', currentIndex);
  subContentElement.innerHTML = "";
  if (showMeaning) {
    let meaningContent = "";
    for (const key of keySub) {
      if (dataSource[currentIndex][key] != "") {
        meaningContent +=
          '<div><strong style="font-size:0.5em">' + key + "- </strong>";
        meaningContent += dataSource[currentIndex][key] + "</div>";
      }
    }
    meaningContentElement.innerHTML = meaningContent;
  } else meaningContentElement.innerHTML = "";

  //   speak(dataSource[currentIndex][keyMain]);
}
