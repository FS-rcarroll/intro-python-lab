(() => {
  "use strict";

  const PYODIDE_VERSION = "0.27.5";
  const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

  const editor = document.getElementById("code-editor");
  const consoleEl = document.getElementById("console-out");
  const runBtn = document.getElementById("btn-run");
  const clearBtn = document.getElementById("btn-clear-output");
  const statusEl = document.getElementById("engine-status");
  const lessonList = document.getElementById("lesson-list");

  /** @type {any} */
  let pyodide = null;
  let running = false;
  let activeLessonId = null;

  function setStatus(state, text) {
    statusEl.dataset.state = state;
    statusEl.textContent = text;
  }

  function appendLine(text, kind = "out") {
    const span = document.createElement("span");
    span.className = `line-${kind}`;
    span.textContent = text.endsWith("\n") ? text : `${text}\n`;
    consoleEl.appendChild(span);
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }

  function clearConsole() {
    consoleEl.textContent = "";
  }

  function setRunning(isRunning) {
    running = isRunning;
    runBtn.disabled = isRunning || !pyodide;
    runBtn.textContent = "";
    const icon = document.createElement("span");
    icon.className = "run-icon";
    icon.setAttribute("aria-hidden", "true");
    runBtn.appendChild(icon);
    runBtn.appendChild(document.createTextNode(isRunning ? "Running…" : "Run"));
  }

  function loadLesson(lesson, { announce = true } = {}) {
    editor.value = lesson.code;
    activeLessonId = lesson.id;
    for (const btn of lessonList.querySelectorAll(".lesson-btn")) {
      btn.setAttribute("aria-pressed", String(btn.dataset.id === lesson.id));
    }
    if (announce) {
      appendLine(`Loaded starter: ${lesson.title}`, "meta");
    }
  }

  function renderLessons() {
    const lessons = window.PYTHON_LESSONS || [];
    lessonList.replaceChildren();
    for (const lesson of lessons) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lesson-btn";
      btn.dataset.id = lesson.id;
      btn.textContent = lesson.title;
      btn.setAttribute("role", "listitem");
      btn.addEventListener("click", () => loadLesson(lesson));
      lessonList.appendChild(btn);
    }
    if (lessons[0]) {
      loadLesson(lessons[0], { announce: false });
    }
  }

  function handleTabKey(event) {
    if (event.key !== "Tab") return;
    event.preventDefault();
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const value = editor.value;
    if (event.shiftKey) {
      const before = value.slice(0, start);
      const lineStart = before.lastIndexOf("\n") + 1;
      if (value.slice(lineStart, lineStart + 4) === "    ") {
        editor.value = value.slice(0, lineStart) + value.slice(lineStart + 4);
        editor.selectionStart = Math.max(lineStart, start - 4);
        editor.selectionEnd = Math.max(lineStart, end - 4);
      } else if (value.slice(lineStart, lineStart + 1) === "\t") {
        editor.value = value.slice(0, lineStart) + value.slice(lineStart + 1);
        editor.selectionStart = Math.max(lineStart, start - 1);
        editor.selectionEnd = Math.max(lineStart, end - 1);
      }
      return;
    }
    editor.value = `${value.slice(0, start)}    ${value.slice(end)}`;
    editor.selectionStart = editor.selectionEnd = start + 4;
  }

  async function loadPyodideEngine() {
    setStatus("loading", "Loading Python…");
    try {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `${PYODIDE_BASE}pyodide.js`;
        script.onload = resolve;
        script.onerror = () =>
          reject(
            new Error(
              "Could not download Pyodide. Allowlist cdn.jsdelivr.net (see teacher guide)."
            )
          );
        document.head.appendChild(script);
      });

      pyodide = await window.loadPyodide({
        indexURL: PYODIDE_BASE,
        stdout: (msg) => appendLine(String(msg), "out"),
        stderr: (msg) => appendLine(String(msg), "err"),
      });

      // Make input() use the browser prompt so intro labs stay simple.
      await pyodide.runPythonAsync(`
import builtins

def _lab_input(prompt=""):
    from js import prompt as _js_prompt
    value = _js_prompt(str(prompt) if prompt is not None else "")
    if value is None:
        raise EOFError("input cancelled")
    return str(value)

builtins.input = _lab_input
`);

      setStatus("ready", "Python ready · in-browser");
      setRunning(false);
      appendLine("Python engine ready. Press Run or Ctrl/Cmd+Enter.", "ok");
    } catch (err) {
      console.error(err);
      setStatus("error", "Python failed to load");
      appendLine(String(err.message || err), "err");
      appendLine(
        "First load needs: cdn.jsdelivr.net (Pyodide WASM). After cache, Run stays local.",
        "meta"
      );
      runBtn.disabled = true;
    }
  }

  async function runCode() {
    if (!pyodide || running) return;
    const code = editor.value;
    setRunning(true);
    appendLine("——— Run ———", "meta");
    try {
      await pyodide.runPythonAsync(code);
      appendLine("——— Done ———", "ok");
    } catch (err) {
      const message = String(err.message || err);
      // Pyodide often prefixes with the Python traceback already printed to stderr;
      // still show a clear summary line.
      if (!message.includes("Traceback")) {
        appendLine(message, "err");
      } else {
        // Ensure the last line is visible even if stdout/stderr already streamed.
        const lines = message.trim().split("\n");
        appendLine(lines[lines.length - 1], "err");
      }
      appendLine("——— Error ———", "err");
    } finally {
      setRunning(false);
      editor.focus();
    }
  }

  function onGlobalKeydown(event) {
    const isRun =
      (event.ctrlKey || event.metaKey) &&
      (event.key === "Enter" || event.code === "Enter");
    if (isRun) {
      event.preventDefault();
      runCode();
    }
  }

  runBtn.addEventListener("click", runCode);
  clearBtn.addEventListener("click", clearConsole);
  editor.addEventListener("keydown", handleTabKey);
  window.addEventListener("keydown", onGlobalKeydown);

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {
        /* optional cache helper — ignore failures */
      });
    });
  }

  renderLessons();
  loadPyodideEngine();
})();
