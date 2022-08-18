import "./style.css";

import { render } from "preact";

import { createState, makeReactive } from "@barelyhuman/mage";
import { CodeJar } from "codejar";
import hljs from "highlight.js";

const state = createState({
  value: "",
});

const baseStyleUrl = "https://unpkg.com/highlight.js@11.6.0/styles/";
const defaultTheme = "default";
const validStyles = {
  default: "default.css",
  "base16/github": "base16/github.css",
  "mono-blue": "mono-blue.css",
  "base16/tomorrow": "base16/tomorrow.css",
  "color-brewer": "color-brewer.css",
  vs: "vs.css",
  "atom-one-light": "atom-one-light.css",
};

let jar;

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
  injectUrl(url);
};

function _App() {
  return (
    <div class="screen-container">
      <h1 class="null">codescreen</h1>
      <p class="muted">simple code presentation for screenshots</p>
      <select onChange={onThemeChange}>
        {Object.keys(validStyles).map((opt) => {
          return <option value={opt}>{opt}</option>;
        })}
      </select>
      <br />
      <div class="code-container">
        <div class="codejar-editor"></div>
      </div>
    </div>
  );
}

const App = makeReactive(state)(_App);

App.onMount(() => {
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

  jar.updateCode(`function demo(){
	console.log("demo code")
}`);

  setTimeout(() => {
    elm.focus();
  }, 10);
});

render(<App />, document.getElementById("app"));
