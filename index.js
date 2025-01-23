let textarea;

function setCookie(key, value) {
  let expire = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  value = encodeURIComponent(value);
  document.cookie = `${key}=${value}; expires=${expire}; path=/`;
}

function typeInTextarea(newText, el = document.activeElement) {
  const [start, end] = [el.selectionStart, el.selectionEnd];
  el.setRangeText(newText, start, end, "end");
}

function unsetItalic() {
  textarea.style.fontStyle = "";
  setCookie("italic", textarea.style.fontStyle);
}

function setItalic() {
  textarea.style.fontStyle = "italic";
  setCookie("italic", textarea.style.fontStyle);
}

function unsetBold() {
  textarea.style.fontWeight = "";
  setCookie("bold", textarea.style.fontWeight);
}

function setBold() {
  textarea.style.fontWeight = "bold";
  setCookie("bold", textarea.style.fontWeight);
}

function unsetUnderline() {
  textarea.style.textDecoration = "";
  setCookie("underline", textarea.style.textDecoration);
}

function setUnderline() {
  textarea.style.textDecoration = "underline";
  setCookie("underline", textarea.style.textDecoration);
}

function alignLeft() {
  textarea.style.textAlign = "left";
  setCookie("align", textarea.style.textAlign);
}

function alignJustify() {
  textarea.style.textAlign = "justify";
  setCookie("align", textarea.style.textAlign);
}

function alignCenter() {
  textarea.style.textAlign = "center";
  setCookie("align", textarea.style.textAlign);
}

function alignRight() {
  textarea.style.textAlign = "right";
  setCookie("align", textarea.style.textAlign);
}

function setFont(font) {
  textarea.classList.remove("sans-serif");
  textarea.classList.remove("serif");
  textarea.classList.remove("monospaced");

  textarea.classList.add(font);
  setCookie("font", font);
}

function saveTextFile() {
  const text = textarea.value;
  const link = document.createElement("a");

  link.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  link.download = new Date().getTime() + ".txt";
  link.click();

  URL.revokeObjectURL(link.href);
}

function loadTextFile() {
  const reader = new FileReader();
  const file = document.createElement("input");
  file.type = "file";
  file.addEventListener("change", () => {
    reader.readAsText(file.files[0]);
  });
  reader.onload = (e) => {
    setCookie("content", e.target.result);
    textarea.value = e.target.result;
  };
  file.click();
}

function setColorScheme(scheme) {
  if (!scheme) {
    document.body.classList.remove("dark");
    document.body.classList.remove("light");
    return;
  }

  document.body.classList.remove(scheme === "light" ? "dark" : "light");
  document.body.classList.add(scheme === "light" ? "light" : "dark");
}

function emojiCommand() {
  let content = textarea.value;

  // find the emoji string provided
  let lastSpaceIndex = -1;
  for (let i = content.length - 1; i >= 0; i--) {
    if (content[i] === " " || content[i] === "\n" || content[i] === "\t") {
      lastSpaceIndex = i;
      break;
    }
  }

  let emojiString = content.substring(lastSpaceIndex + 1, content.length);

  // adding emoji
  let emoji = emojiMap[emojiString];
  // find emoji is emoji is not found
  if (emoji === undefined) {
    Object.keys(emojiMap).forEach((key) => {
      if (emoji !== undefined) return;

      if (key.indexOf(emojiString) !== -1) {
        emoji = emojiMap[key];
      }
    });
  }
  // if after that emoji is not found, just paste nothing
  if (emoji === undefined) {
    emoji = "";
  }

  textarea.value = textarea.value.substring(0, lastSpaceIndex + 1) + emoji;
}

const commands = [
  { keyword: "bold", command: setBold },
  { keyword: "unbold", command: unsetBold },
  { keyword: "italic", command: setItalic },
  { keyword: "unitalic", command: unsetItalic },
  { keyword: "underline", command: setUnderline },
  { keyword: "ununderline", command: unsetUnderline },
  { keyword: "left", command: alignLeft },
  { keyword: "justify", command: alignJustify },
  { keyword: "center", command: alignCenter },
  { keyword: "right", command: alignRight },
  { keyword: "serif", command: () => setFont("serif") },
  { keyword: "sans", command: () => setFont("sans-serif") },
  { keyword: "mono", command: () => setFont("monospaced") },
  { keyword: "save", command: saveTextFile },
  { keyword: "load", command: loadTextFile },
  { keyword: "clear", command: () => (textarea.value = "") },
  { keyword: "dark", command: () => setColorScheme("dark") },
  { keyword: "light", command: () => setColorScheme("light") },
  { keyword: "emoji", command: emojiCommand },
  { keyword: "sound", command: setPlaySound },
  { keyword: "unsound", command: unsetPlaySound },
  { keyword: "di", command: diacritic}
];

let isDarkMode = false;

function updateIsDarkMode() {
  isDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
}

const sounds = [];
for (let i = 1; i <= 20; i++) {
  if (i < 10) {
    i = `0${i}`;
  }

  sounds.push(new Audio(`./sound/writing - ${i}.wav`));
}
let playSound = false;

function setPlaySound() {
  playSound = true;
  setCookie("sound", "on");
}

function unsetPlaySound() {
  playSound = false;
  setCookie("sound", "off");
}

const DIACRITIC_MAP_JSON = "./latin.json";
let diacriticMap;
getJSON(DIACRITIC_MAP_JSON, (err, data) => {
  if (err !== null) return;
  diacriticMap = data;
});

function diacritic() {
  const selectionStart = textarea.selectionStart;
  let previousContent = textarea.value.substring(0, selectionStart);
  const nextContent = textarea.value.substring(selectionStart);

  Object.keys(diacriticMap).forEach(k => {
    if (previousContent.substring(previousContent.length - k.length) === k) {
      const value = diacriticMap[k];
      previousContent = previousContent.substring(0, previousContent.length - k.length) + value;
    }

    if (previousContent.substring(previousContent.length - k.length) === k.toUpperCase()) {
      const value = diacriticMap[k].toUpperCase();
      previousContent = previousContent.substring(0, previousContent.length - k.length) + value;
    }
  });

  textarea.value = previousContent + nextContent;
  textarea.selectionStart = previousContent.length;
  textarea.selectionEnd = previousContent.length;
}

function onload() {
  // --- color scheme things
  updateIsDarkMode();

  // --- textarea things
  textarea = document.querySelector("textarea");

  document.cookie.split("; ").forEach((cookie) => {
    let [key, value] = cookie.split("=");

    value = decodeURIComponent(value);
    if (key === "content") {
      textarea.value = value;
    } else if (key === "italic") {
      textarea.style.fontStyle = value;
    } else if (key === "bold") {
      textarea.style.fontWeight = value;
    } else if (key === "underline") {
      textarea.style.textDecoration = value;
    } else if (key === "align") {
      textarea.style.textAlign = value;
    } else if (key === "font") {
      textarea.classList.remove("sans-serif");
      textarea.classList.add(value);
    } else if (key === "sound") {
      playSound = value === "on";
    }
  });

  textarea.addEventListener("input", (e) => {
    setCookie("content", e.target.value);
  });

  document.addEventListener("keyup", (e) => {
    let compose = e.metaKey || e.ctrlKey;

    // check if command is inserted
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    if (selectionEnd !== selectionStart) {
      return;
    }

    const previousContent = textarea.value.substring(0, selectionStart);
    const nextContent = textarea.value.substring(selectionEnd);
    commands.forEach((command) => {
      if (previousContent.endsWith(`/${command.keyword}`)) {
        textarea.value = previousContent.slice(0, -command.keyword.length - 1) + nextContent;
        textarea.selectionStart = selectionStart - command.keyword.length - 1;
        textarea.selectionEnd = selectionStart - command.keyword.length - 1;
        command.command();
      }
    });

    if (compose && e.code === "KeyP") {
      e.preventDefault();

      setColorScheme();
    }
  });

  document.addEventListener("keydown", (e) => {
    // -- play sound
    while (playSound) {
      const soundIndex = parseInt(Math.random() * sounds.length);

      const sound = sounds[soundIndex];
      if (!(sound.duration > 0 && !sound.paused)) {
        sound.play();
        break;
      }

      let allPlaying = true;
      for (let i = 0; i < 20; i++) {
        const s = sounds[soundIndex];
        if (!(s.duration > 0 && !s.paused)) {
          allPlaying = false;
        }
      }
      if (allPlaying) {
        break;
      }
    }

    // -- do compose key stuff
    let compose = e.metaKey || e.ctrlKey;

    // insert tab if tag is pressed
    if (e.code === "Tab") {
      e.preventDefault();
      typeInTextarea("\t");
      return;
    }

    // toggle italic
    if (compose && e.code === "KeyI") {
      e.preventDefault();

      if (textarea.style.fontStyle) unsetItalic();
      else setItalic();

      return;
    }
    // toggle bold
    if (compose && e.code === "KeyB") {
      e.preventDefault();

      if (textarea.style.fontWeight) unsetBold();
      else setBold();

      return;
    }
    // toggle underline
    if (compose && e.code === "KeyU") {
      e.preventDefault();

      if (textarea.style.textDecoration) unsetUnderline();
      else setUnderline();

      return;
    }

    // align left
    if (compose && e.code === "KeyH" && e.shiftKey) {
      e.preventDefault();
      alignLeft();
      return;
    }
    // align justify
    if (compose && e.code === "KeyJ" && e.shiftKey) {
      e.preventDefault();
      alignJustify();
      return;
    }
    // align center
    if (compose && e.code === "KeyK" && e.shiftKey) {
      e.preventDefault();
      alignCenter();
      return;
    }
    // align right
    if (compose && e.code === "KeyL" && e.shiftKey) {
      e.preventDefault();
      alignRight();
      return;
    }

    // change font family
    if (compose && e.code === "KeyS" && e.shiftKey) {
      e.preventDefault();

      if (textarea.classList.contains("sans-serif")) {
        setFont("serif");
      } else if (textarea.classList.contains("serif")) {
        setFont("monospaced");
      } else {
        setFont("sans-serif");
      }

      return;
    }

    // change color scheme
    if (compose && e.code === "KeyP") {
      e.preventDefault();

      setColorScheme(isDarkMode ? "light" : "dark");

      return;
    }

    // convert to emoji
    if (compose && e.code === "KeyE") {
      e.preventDefault();

      emojiCommand();

      return;
    }
  });

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      updateIsDarkMode();
      console.log("color scheme changed");
    });
}
