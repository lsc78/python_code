importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js');

let pyodide;

async function initialize() {
  try {
    pyodide = await loadPyodide();
    self.postMessage({ type: 'ready' });
  } catch (error) {
    self.postMessage({ type: 'fatal', error: `Python 실행 환경을 불러오지 못했어요. 인터넷 연결을 확인해 주세요.\n${error.message}` });
  }
}

function normalizeOutput(text) {
  return String(text).replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, '').replace(/\n+$/, '');
}

self.addEventListener('message', async event => {
  if (!pyodide || event.data.type !== 'judge') return;
  const { code, tests } = event.data;
  const results = [];
  for (const test of tests) {
    try {
      pyodide.globals.set('__solution_code', code);
      pyodide.globals.set('__test_input', test.input);
      const actual = await pyodide.runPythonAsync(`
import contextlib as __contextlib
import io as __io
import sys as __sys
__old_stdin = __sys.stdin
__captured = __io.StringIO()
__sys.stdin = __io.StringIO(__test_input)
try:
    with __contextlib.redirect_stdout(__captured):
        exec(compile(__solution_code, "<solution>", "exec"), {"__name__": "__main__"})
    __result = __captured.getvalue()
finally:
    __sys.stdin = __old_stdin
__result
      `);
      const output = actual.toString();
      if (typeof actual.destroy === 'function') actual.destroy();
      const pass = normalizeOutput(output) === normalizeOutput(test.expected);
      results.push({ pass });
    } catch (error) {
      results.push({ pass: false, error: String(error).split('\n').slice(-4).join('\n') });
    }
  }
  self.postMessage({ type: 'result', results });
});

initialize();
