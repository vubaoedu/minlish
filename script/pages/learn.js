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

  const dataName = params.get("dataName");
  const status = params.get("status");
  const category = params.get("category");

  function startAutoPlay() {
    (async function loop() {
      while (state.autoPlay) {
        await goToNextWord();
      }
    })();
  }
  
  function stopAutoPlay() {
    state.autoPlay = false;
  }
  


  async function goToNextWord() {
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
      show(dataName, true);
      const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const meaning = state.dataSource[state.currentIndex]["meaning"];
      // const example = state.dataSource[state.currentIndex]["example"];
      if (!isMobile) {
        textToSpeak.push({ text: meaning, lang: "vi-VN" });
      }
      // textToSpeak.push({ text: example, lang: "en-US" });
      // textToSpeak = [
      //   ...textToSpeak,
      //   { text: meaning, lang: "vi-VN" },
      //   { text: example, lang: "en-US" },
      // ];
    }
  
    await speakSequence(textToSpeak);         // chờ đọc xong
    await new Promise(r => setTimeout(r, 10000)); // đợi thêm 10 giây
  }
  

  if (dataName) {
    await loadData(dataName);
    let currentFilter = {};
    if (status)
      currentFilter = {...currentFilter, status}; 
    if (category)
      currentFilter = {...currentFilter, category}; 
    if (status) {
      state.dataSource = getData(dataName, currentFilter);
      if (state.dataSource.length > 0) {
        state.currentIndex = 0;

        const previousBtn = getElement("previous");
        previousBtn.addEventListener("click", () => {
          state.isFront = false;
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
          if (!state.isFront) show(dataName, true);
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
          const indexToUpdate = state.dataSource[state.currentIndex].index
        
          updateWordByIndex(indexToUpdate, "status", newStaus);
          nextBtn.click();
        });

        const rememberBtn = getElement("remember");
        rememberBtn.addEventListener("click", () => {
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 }
          });
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
          console.log('state.dataSource', state.dataSource);
          const indexToUpdate = state.dataSource[state.currentIndex].index
          console.log(newStaus);
          updateWordByIndex(indexToUpdate, "status", newStaus);
          
          nextBtn.click();
        });
        nextBtn.click(); // Fix tạm
        show(dataName);
      }
    }
  }

  document
    .getElementById("auto-play-toggle")
    .addEventListener("change", (e) => {
      state.autoPlay = e.target.checked;
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
        "collocation",
        "relatedWord",
        "meaning",
        "note",
        "example",
        "imgURL",
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

function speakSequence(texts) {
  return new Promise((resolve) => {
    if (!Array.isArray(texts) || texts.length === 0) {
      resolve();
      return;
    }

    let index = 0;

    function speakNext() {
      if (index >= texts.length) {
        resolve(); // đọc xong hết thì resolve
        return;
      }

      const { text, lang } = texts[index];
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 1;

      utterance.onend = () => {
        index++;
        speakNext();
      };

      speechSynthesis.speak(utterance);
    }

    speechSynthesis.cancel();
    speakNext();
  });
}


function showContent(keyMain, keySub = [], showMeaning = false) {
  const { dataSource, currentIndex } = state;
  const mainContentElement = getElement("main-content");
  const subContentElement = getElement("sub-content");
  const meaningContentElement = getElement("meaning-content");
  mainContentElement.innerHTML = dataSource[currentIndex][keyMain];
  subContentElement.innerHTML = "";
  const imgDivElement = document.createElement('div');
  // console.log(dataSource[currentIndex]['imgURL']);
  if (showMeaning) {
    let meaningContent = "";
    for (const key of keySub) {
      if (dataSource[currentIndex][key] != "") {
        if (key == 'imgURL') {
          console.log('hi');
          imgDivElement.className = key;
          imgDivElement.style.backgroundImage = `url("${dataSource[currentIndex][key]}")`;

          // meaningContent +=
          // '<div class="imgURL"></div>';
        }
        else {
          meaningContent +=
          '<span style="font-size:0.6em; font-weight: bold; font-family: monospace">' + key + "- </span>";
          meaningContent += dataSource[currentIndex][key] + '<br>';
        }
      }
    }
    // meaningContent += '</div>'
    meaningContentElement.innerHTML = meaningContent;
    // meaningContentElement.appendChild(imgDivElement);
    meaningContentElement.insertBefore(imgDivElement, meaningContentElement.firstChild);
    // meaningContentElement.getElementsByClassName('imgURL')[0].style.backgroundImage = dataSource[currentIndex]['imgURL'];
  } else meaningContentElement.innerHTML = "";

  //   speak(dataSource[currentIndex][keyMain]);
}
