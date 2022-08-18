import "./style.css";

import { h, render } from "preact";

import { createState, makeReactive } from "@barelyhuman/mage";
import { CodeJar } from "codejar";
import hljs from "highlight.js";
import {
  init,
  getCurrentThemeSimplified,
  toggleTheme,
} from "@barelyreaper/themer";

const defaultCode = `(defun fibonacci (n)
    (loop for a = 0 then b
          and b = 1 then (+ a b)
          repeat n finally (return a)))`;

const baseStyleUrl = "https://unpkg.com/highlight.js@11.6.0/styles/";

const validStyles = {
  "base16/github": "base16/github.css",
  "mono-blue": "mono-blue.css",
  "base16/tomorrow": "base16/tomorrow.css",
  "color-brewer": "color-brewer.css",
  vs: "vs.css",
  "atom-one-light": "atom-one-light.css",
  "arduino-light": "arduino-light.css",
  ascetic: "ascetic.css",
  "base16/atelier-lakeside-light": "base16/atelier-lakeside-light.css",
  "base16/circus": "base16/circus.css",
  "base16/grayscale-light": "base16/grayscale-light.css",
  "panda-syntax-light": "panda-syntax-light.css",
};

const sortedStyleKeys = Object.keys(validStyles).sort();
const defaultTheme = "panda-syntax-light";

const state = createState({
  value: "",
  theme: defaultTheme,
  siteTheme: getInvertedTheme(),
});

let jar;
let themeSub;

function getInvertedTheme() {
  return getCurrentThemeSimplified() == "light" ? "dark" : "light";
}

const injectUrl = (url) => {
  const _exist = document.head.getElementsByClassName("editor-theme");
  if (_exist && _exist.length) document.head.removeChild(_exist[0]);
  const _link = document.createElement("link");
  _link.classList.add("editor-theme");
  _link.rel = "stylesheet";
  _link.href = url;
  document.head.appendChild(_link);
};

const injectDefaultTheme = () => {
  injectUrl(baseStyleUrl + validStyles[defaultTheme]);
};

const onThemeChange = (e) => {
  if (!validStyles[e.target.value]) {
    return;
  }
  const url = baseStyleUrl + validStyles[e.target.value];
  state.theme = e.target.value;
  injectUrl(url);
};

function onSiteThemeChange() {
  toggleTheme();
  state.siteTheme = getInvertedTheme();
}

function _App() {
  return (
    <>
      <div class="screen-container">
        <h1 class="null">codescreen</h1>
        <p class="muted">simple code presentation for screenshots</p>
        <div class="menu-container">
          <select onChange={onThemeChange} value={state.theme}>
            {sortedStyleKeys.map((opt) => {
              return <option value={opt}>{opt}</option>;
            })}
          </select>
          <button type="button" onClick={onSiteThemeChange}>
            {state.siteTheme}
          </button>
        </div>
        <br />
        <div class="code-container">
          <div class="codejar-editor"></div>
        </div>
      </div>
    </>
  );
}

const App = makeReactive(state)(_App);

App.onMount(() => {
  themeSub = init();

  injectDefaultTheme();

  const elm = document.querySelector(".codejar-editor");
  if (!elm) {
    return;
  }
  jar = CodeJar(
    elm,
    (editor) => {
      const code = editor.textContent;
      editor.innerHTML = hljs.highlightAuto(code).value;
    },
    { tab: " ".repeat(2) }
  );

  jar.updateCode(defaultCode);

  setTimeout(() => {
    elm.focus();
  }, 10);
});

App.onDestroy(() => {
  themeSub();
});

render(<App />, document.getElementById("app"));
