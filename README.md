# RoboticsClub · Intro Python Lab

Browser-only Python lab for OCPS / RoboticsClub students. Code runs with **Pyodide (WASM)** in the browser — no external Run API — so teacher/guest WiFi restrictions that break sites like pyfiddle.net do not block execution after Python loads.

## Use

1. Open the published app URL (or open `index.html` via any static file server).
2. Wait for **Python ready · in-browser**.
3. Edit code, press **Run** or **Ctrl/Cmd+Enter**.
4. Load starters from the Starters row (Hello, Variables, If/Else, Loops, Functions).

## Network / allowlist (first load)

First visit downloads Pyodide from jsDelivr:

- `cdn.jsdelivr.net` (required for first Python engine load)

Optional (fonts; app still works if blocked — falls back to system fonts):

- `fonts.googleapis.com`
- `fonts.gstatic.com`

After the browser caches Pyodide, **Run stays local** and does not call a remote code runner.

## Local preview

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000

## Stack

Static HTML/CSS/JS + Pyodide 0.27.x. Service worker caches the app shell.
